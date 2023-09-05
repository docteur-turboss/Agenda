const { ErrorException, errorCode } = require('../models/error.models');
const permission = require('../models/permission.models');
let UserModel = require('../models/user.models');

module.exports.isAuthenticatedUser = async(req, res, next) =>{
  try{
    let {cookies, headers} = req;
    /* On vérifie les accès */
    if((!cookies || !cookies.secureCookie) && (!headers || !headers['token'])){
      return next(new ErrorException(errorCode.Unauthenticated, "Certaines informations de sécurité sont manquantes"))
    }

    let confirmAuth = req.signedCookies.auth
    let AuthTok = headers['token']

    let id = Buffer.from(AuthTok.split('.')[0], 'base64url').toString('utf-8')
    let userInformation = await UserModel.selectUser({ID : id})

    if(userInformation.success === false || userInformation.data.user[0].token !== AuthTok || userInformation.data.user[0].CookieSecure !== confirmAuth){
      return next(new ErrorException(errorCode.Forbidden, "L'utilisateur n'existe pas ou les informations de sécurité ne sont pas valides."))
    }

    req.UserID = id
    return next()
  }catch(err){
    console.log("AUTH (backend/middlewares/auth) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
}

module.exports.authorizeRoles = (role) => async (req, res, next) =>{
  let userInformation = await UserModel.selectUser({ID : req.UserID});
  if(userInformation[0] == false){
    return next(new ErrorException(errorCode.Unauthenticated, "Vous n'êtes pas connecté."))
  }
  if(userInformation.Type === role){
    return next()
  }
  return next(new ErrorException(errorCode.Forbidden, "Vous n'avez pas les rôles requis pour cette action."))
}

module.exports.hasPerm = (role) => async (req, res, next) =>{
  try{
    if(!req.fields.OrganisationID || !req.UserID){
      return next(new ErrorException(errorCode.NotAcceptable, "Certaines informations obligatoires sont manquantes"))
    }
    let userInformation = await permission.selectPerm({User_ID : req.UserID, Organisation_ID : req.fields.OrganisationID});
    if(userInformation.success == false){
      return next(new ErrorException(errorCode.Unauthenticated, "Vous n'êtes pas authentifié réglementairement."))
    }
    userInformation = userInformation.data.perms[0]
  
    let RolesPerm = {
      viewer : {
        viewer : () =>  next(),
        commenter : () => next(),
        manager : () => next()
      },
      commenter : {
        viewer : () => next(new ErrorException(errorCode.Forbidden, "Vous n'avez pas le grade requis pour cette action.")),
        commenter : () => next(),
        manager : () =>  next()
      },
      manager : {
        viewer : () => next(new ErrorException(errorCode.Forbidden, "Vous n'avez pas le grade requis pour cette action.")),
        commenter : () =>  next(new ErrorException(errorCode.Forbidden, "Vous n'avez pas le grade requis pour cette action.")),
        manager : () =>  next()
      }
    }
    if(RolesPerm !== undefined && await userInformation.Permission in RolesPerm){
      return await RolesPerm[role][userInformation.Permission]()
    }else{
      console.log("AUTH (backend/middlewares/auth) HAS ERROR :")
      console.log("Erreur connu à la main : RolesPerm === undefined || userInformation.Permission n'est pas dans RolesPerm")
  
      console.log("RolesPerm : ", RolesPerm)
      console.log("userInformation.Permission in RolesPerm : ", userInformation.Permission in RolesPerm)
      next(new ErrorException(errorCode.UnknownError))
    }
  }catch(err){
    console.log("AUTH (backend/middlewares/auth) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
}