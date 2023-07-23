const suppNotUsed = require('../utils/deleteParamsNotUsed');
const {hashSync, compare} = require("bcryptjs")
const validator = require("email-validator")
const {createHash} = require("crypto")
const db = require("../config/db")

class User {
  /*Création d'un nouvel user*/
  static async createUser(ModelsNormailise={Pseudo, Email, password, Type : "simpleUser", join_date : new Date()}){
    let userObj = await User.modelNormilizer(ModelsNormailise, true)

    if(userObj[0] == false){
      /* Return un array de 3 paramètre d'err. */
      return userObj
    }

    let userID = await db("user").insert(userObj, ["ID"])
    userID = userID[0]

    if(userID == undefined){
      return [false, 500]
    }

    return {
      status: 201,
      data : userID
    }
 }


  /*modification de l'user*/
  static async updateUser (UserInformationToUp = {Pseudo, Email, password, Type}, condition = {ID, Email}) {
    condition = suppNotUsed(condition)
    let ObjUser = await User.modelNormilizer(UserInformationToUp)

    if(ObjUser[0] == false){
      /* Return un array de 3 paramètre d'err. */
      return ObjUser
    }
    let UpdUser = await db("user")
    .update(ObjUser, ["ID"])
    .where(condition)
    
    if(UpdUser[0] === undefined){
      return [false, 500]
    }

    return {
     status: 202,
     data: "Utilisateur bien modifié." 
    }
  }

  /*détruction de l'user*/
  static async destroyUser (condition ={ID, Email}){
    condition = suppNotUsed(condition)

    if(!condition.ID && !(condition.Email && validator.validate(condition.Email))){
      return [false, 406, "L'email fourni n'est pas valide."]    
    }

    let Ise = await User.selectUser(condition)
    if(Ise[0] == false){
      /* Return un array de 3 paramètre d'err. */
      return Ise
    }

    let UsReturn = await db("user")
    .where(condition)
    .del( ["ID"] )

    if(UsReturn[0] === undefined){
      return [false, 500]
    }

    return {
      status: 200,
      data: "Utilisateur bien détruit." 
     }
  }

  /* sélection d'un ou plusieurs user*/
  static async selectUser (condition = {ID : undefined, Email : undefined}){
    if(condition.Email && validator.validate(condition.Email) === false){
      return [false, 406, "L'email fournit n'est pas valide."]
    }

    condition = suppNotUsed(condition)

    let userinfo = await db("user")
    .select("ID","Pseudo", "join_date", "Type", "token", "CookieSecure")
    .where(condition)

    if(userinfo[0] == undefined){
      return [false, 404, "Utilisateur introuvable."]
    }
    
    return {
      status: 200,
      data : userinfo
    }
  }

  /* algorithm de création du cookie de sécurité et du token*/
  static async createSecurityAuth (idUser) {
    if(idUser === undefined){
      return [false, 406, "No id provided."]
    }
    let user = await User.selectUser({ID : idUser})

    if(user[0] == false){
      return user
    }
    
    let role = user.data[0].Type
    
    let firstParToken = Buffer.from(`${idUser}`, "utf-8").toString("base64url") + ".";
    let secondParToken = Buffer.from(`${Date.now() - new Date(2022, 2, 27, 18).getTime()}`, "utf-8").toString("base64url") + ".";

    let Completetoken = firstParToken + 
    secondParToken + 
    Buffer.from(`${hashSync(createHash("sha256").update(role).digest("hex"),10) }`, "utf-8").toString("base64url");

    let cookieSecure = Buffer.from(`${hashSync(createHash("sha256").update(`${
      firstParToken + 
      secondParToken + 
      Buffer.from(`${Completetoken}`, "utf-8").toString("base64url")
    }`).digest("hex"), 10)}`, "utf-8").toString("base64url")
    
    await db("user")
    .update({ 
      token : Completetoken,
      CookieSecure : cookieSecure
    })
    .where({ID : idUser})

    return {
      status : 200,
      data : {token : Completetoken, cookieSecure : cookieSecure}
    }
  }

  /*essaie de voir une corrélation entre les mot de passe*/
  static async comparePassword(email, password) {
    if(!email || !password){
      return [false, 401, "Email ou Mot de passe invalide."]
    }

    let result = await db("user")
    .select("password", "token", "CookieSecure")
    .where({
      Email : email
    })
    result = result[0]

    if(!result){
      return [false, 401, "Email ou Mot de passe invalide."]
    }

    if(await compare(createHash("sha256").update(password).digest("hex"), result.password) == true){
      return {
        status : 200,
        data : {token : result.token, CookieSecure : result.CookieSecure}
      }
    }

    return [false, 401, "Email ou Mot de passe invalide."]
  }

  /*normaliser la donnée*/
  static async modelNormilizer(Userobj = {Pseudo : undefined, Email : undefined, password : undefined, Type : undefined, join_date : undefined}, obligatoir = false){

    if(obligatoir){
      if(!Userobj.join_date){
        Userobj.join_date = new Date()
        Userobj.Type = "simpleUser"
      }
      if(!Userobj.Pseudo || !Userobj.password || !Userobj.Email){
        return [false, 406, "No pseudo or password or email provided."]
      }
    }

    if(Userobj.Pseudo && (Userobj.Pseudo.length < 3 || Userobj.Pseudo.length > 50)){
      return [false, 406, "Le pseudo fait plus de 50 caractère ou moins de 3."]
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
          return [false, 500, "Une erreur interne est survenu."]
        }
        else{
          break;
        }
      default : 
        return [false, 500, "Une erreur interne est survenu."]
    }

    if(Userobj.Email){
      Userobj.Email = await Userobj.Email.toLowerCase()
      if(!validator.validate(Userobj.Email)){
        return [false, 406, "Votre email est invalide."]
      }

      let userInfo = await User.selectUser({Email : Userobj.Email})

      if(userInfo[0] !== false){
        return [false, 403, "L'email fourni est déjà prit."]
      }
    }

    if(Userobj.password){
      Userobj.password = hashSync(createHash("sha256").update(Userobj.password).digest("hex"), 10)
    }

    Userobj = suppNotUsed(Userobj)

    return Userobj
  }
}

module.exports = User