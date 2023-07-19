const {hashSync, compare} = require('bcryptjs')
const validator = require('email-validator')
const {createHash} = require("crypto")
const db = require('../config/db')

class User {
  /*Création d'un nouvel user*/
  static async createUser(ModelsNormailise={Pseudo, Email, password, Type : "simpleUser", join_date : new Date()}){
    let userObj = await User.modelNormilizer(ModelsNormailise, true)

    if(userObj[0] == false){
      return userObj
    }

    let userID = await db('user').insert(userObj, ['ID'])
    userID = userID[0]

    if(userID == undefined){
      return [false, 500]
    }
    return userID
 }


  /*modification de l'user*/
  static async updateUser (UserInformationToUp = {Pseudo, Email, password, Type}, condition = {ID, Email}) {
    condition = suppNotUsed(condition)
    let ObjUser = await User.modelNormilizer(UserInformationToUp)

    if(ObjUser[0] == false){
      return ObjUser
    }
    await db('user')
    .update(ObjUser)
    .where(condition)
    
    return true
  }

  /*détruction de l'user*/
  static async destroyUser (condition ={ID, Email}){
    condition = suppNotUsed(condition)

    if(condition.ID || (condition.Email && validator.validate(condition.Email))){
      let Ise = await User.selectUser(condition)
      if(Ise[0] == false){
        return Ise
      }

      await db('user')
      .where(condition)
      .del()

      return true
    }else{
      return [false, 406]
    }
  }

  /* sélection d'un ou plusieurs user*/
  static async selectUser (condition = {ID : undefined, Email : undefined}){
    let userinfo;
    if(condition.ID !== undefined || condition.Email !== undefined){
      condition = suppNotUsed(condition)
      if(condition.ID || (condition.Email && validator.validate(condition.Email))){
        userinfo = await db('user')
        .select("ID","Pseudo", "join_date", "Type", 'token', "CookieSecure")
        .where(condition)
  
        userinfo = userinfo[0]
      }else{
        return [false, 406]
      }
    }else{
      userinfo = await db('user')
      .select("ID","Pseudo", "join_date", "Type", 'token', "CookieSecure")
    }

    if(userinfo == undefined){
      return [false, 404]
    }
    
    return userinfo
  }

  /* algorithm de création du cookie de sécurité et du token*/
  static async createSecurityAuth (idUser) {
    let user = await User.selectUser({ID : idUser})

    if(user[0] == false){
      return user
    }
    
    let role = user.Type
    
    let token =  Buffer.from(`${idUser}`, "utf-8").toString('base64url') + "." + Buffer.from(`${Date.now() - new Date(2022, 2, 27, 18).getTime()}`, "utf-8").toString('base64url') + "." + Buffer.from(`${hashSync(createHash('sha256').update(role).digest('hex'),10) }`, "utf-8").toString('base64url');

    let cookieSecure = Buffer.from(`${hashSync(createHash('sha256').update(`${Buffer.from(`${idUser}`, "utf-8").toString("base64url") + "." + Buffer.from(`${Date.now() - new Date(2022, 2, 27, 18).getTime()}`, "utf-8").toString('base64url') + "." + Buffer.from(`${token}`, 'utf-8').toString('base64url')}`).digest('hex'), 10)}`, 'utf-8').toString('base64url')
    
    await db('user')
    .update({ 
      token : token,
      CookieSecure : cookieSecure
    })
    .where({ID : idUser})

    return {token : token, cookieSecure : cookieSecure}
  }

  /*essaie de voir une corrélation entre les mot de passe*/
  static async comparePassword(email, password) {
    let result = await db('user')
    .select('password', 'token', 'CookieSecure')
    .where({
      Email : email
    })
    result = result[0]

    if(!result){
      return [false, 406]
    }

    if(await compare(createHash('sha256').update(password).digest('hex'), result.password)){
      return {token : result.token, CookieSecure : result.CookieSecure}
    }else{
      return [false, 401]
    }
  }

  /*normaliser la donnée*/
  static async modelNormilizer(Userobj = {Pseudo : undefined, Email : undefined, password : undefined, Type : undefined, join_date : undefined}, obligatoir = false){

    if(obligatoir){
      if(!Userobj.join_date){
        Userobj.join_date = new Date()
      }
      if(!Userobj.Pseudo || !Userobj.password || !Userobj.Type || !Userobj.Email){
        return [false, 406]
      }
    }

    if(Userobj.Pseudo && (Userobj.Pseudo.length < 3 || Userobj.Pseudo.length > 50)){
      return [false, 406]
    }

    switch(Userobj.Type){
      case "simpleUser":
        break;
      case "adminUser":
        break;
      case "premiumUser":
        break;
      case "analystUser" :
        break;
      case undefined : 
        if(obligatoir == true){
          return [false, 500]
        }
        else{
          break;
        }
      default : 
        return [false, 500]
    }

    if(Userobj.Email){
      Userobj.Email = await Userobj.Email.toLowerCase()
      if(!validator.validate(Userobj.Email)){
        return [false, 404]
      }

      let userInfo = await User.selectUser({Email : Userobj.Email})

      if(userInfo[0] !== false){
        return [false, 406]
      }
    }

    if(Userobj.password){
      Userobj.password = hashSync(createHash('sha256').update(Userobj.password).digest('hex'), 10)
    }

    Userobj = suppNotUsed(Userobj)

    return Userobj
  }
}

function suppNotUsed(prop) {
  for (const property in prop) {
    if (!prop[property]) {
      delete prop[property]
    }
  }
  return prop
}

module.exports = User