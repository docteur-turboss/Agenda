const permission = require('../models/permission.models');
let normaliseErr = require('../utils/errorNormaliser');
let UserModel = require('../models/user.models');

module.exports.isAuthenticatedUser = async(req, res, next) =>{
  let {cookies, headers} = req;
  /* On vérifie les accès */
  if((! cookies || !cookies.secureCookie) && (!headers || !headers['token'])){
    return res.status(401).json(normaliseErr(401))
  }

  let confirmAuth = req.cookies.secureCookie
  let AuthTok = headers['token']

  let id = Buffer.from(AuthTok.split('.')[0], 'base64url').toString('utf-8')

  let userInformation = await UserModel.selectUser({ID : id})


  if(userInformation[0] === false && (userInformation.token !== AuthTok || userInformation.CookieSecure !== confirmAuth)){
    return res.status(401).json(normaliseErr(401))
  }

  req.UserID = id
  next()
}

module.exports.authorizeRoles = (role) => async (req, res, next) =>{
  let userInformation = await UserModel.selectUser({ID : req.UserID});
  if(userInformation[0] == false){
    return res.status(401).json(normaliseErr(401))
  }
  if(userInformation.Type === role){
    return next()
  }
  return res.status(401).json(normaliseErr(401))
}

module.exports.hasPerm = (role) => async (req, res, next) =>{
  let userInformation = await permission.selectPerm({User_ID : req.UserID, Organisation_ID : req.fields.OrganisationID});
  if(userInformation[0] == false){
    return res.status(401).json(normaliseErr(401))
  }
  if(userInformation[0] !== undefined){
    userInformation = userInformation[0]
  }

  let RolesPerm = {
    viewer : {
      viewer : () =>  next(),
      commenter : () => next(),
      manager : () => next()
    },
    commenter : {
      viewer : () => res.status(401).json(normaliseErr(401)),
      commenter : () => next(),
      manager : () =>  next()
    },
    manager : {
      viewer : () => res.status(401).json(normaliseErr(401)),
      commenter : () =>  res.status(401).json(normaliseErr(401)),
      manager : () =>  next()
    }
  }
  if(RolesPerm !== undefined && await userInformation.Permission in RolesPerm){
    RolesPerm[role][userInformation.Permission]()
  }else{
    res.status(403).json(normaliseErr(403))
  }
}