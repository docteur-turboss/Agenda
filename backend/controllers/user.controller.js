let catchErr = require('../middlewares/catchAsyncErrors');
let errorNormaliser = require('../utils/errorNormaliser');
let User = require('../models/user.models');
let sendToken = require('../utils/token');
let sendEmail = require('../utils/email');
let fs = require("fs");

/*Enregistre l'user*/
module.exports.signup = catchErr(async (req, res, next) =>{
  let {pseudo, email, password} = req.fields;

  let NewUser = await User.createUser({Pseudo : pseudo, Email: email, password : password, join_date : new Date(), Type: "simpleUser"});
  if(NewUser[0] == false){
    return res.status(NewUser[1]).json(errorNormaliser(NewUser[1]))
  }
  let CookieSecure = await User.createSecurityAuth(NewUser);
  
  sendToken({token : CookieSecure.token , CookieSecure : CookieSecure.cookieSecure}, 201, res);
});

/* Détruit l'user */
module.exports.deleteUser = catchErr(async (req, res, next) =>{
  let user = await User.selectUser({ID : req.UserID});

  if(user[0] == false){
    return res.status(user[1]).json(errorNormaliser(user[1]))
  }

  await User.destroyUser({ID : req.UserID});

  res.clearCookie("secureCookie");

  return res.status(200).json({
    statut : true
  });
});

/* modification d'un utilisateur lambda */
module.exports.updateProfile = catchErr(async (req, res, next_) =>{
  
  if(!req.fields.pseudo && !req.fields.email && !req.fields.password){
    return res.status(406).json(errorNormaliser(406))
  }

  let user = await User.selectUser({ID : req.UserID});

  if(user[0] == false){
    return res.status(user[1]).json(errorNormaliser(user[1]))
  }

  let updateUsed = {};

  (req.fields.email == undefined)   ? '' : updateUsed.Email   = req.fields.email;
  (req.fields.pseudo == undefined)  ? '' : updateUsed.Pseudo  = req.fields.pseudo;
  (req.fields.password == undefined)? '' : updateUsed.password = req.fields.password;

  await User.updateUser(updateUsed, {ID : req.UserID});

  if(req.fields.password){
    let CookiesSecure = await User.createSecurityAuth(req.UserID);

    return sendToken({token : CookiesSecure.token , CookieSecure : CookiesSecure.cookieSecure}, 201, res);
  }
  return res.status(201).json({
    statut : true, 
  });
});

/* connecte un utilisateur */
module.exports.login = catchErr(async (req, res, next) =>{
  if(!req.fields.email || !req.fields.password){
    return res.status(406).json(errorNormaliser(406))
  }

  let informationPass = await User.comparePassword(req.fields.email, req.fields.password);

  if(informationPass[0] == false){
    return res.status(401).json(errorNormaliser(401))
  }

  return sendToken(informationPass, 201, res);
});

/* disconnect un user */
module.exports.logout = catchErr(async (req, res, next) =>{
  res.clearCookie('secureCookie');

  return res.status(200).json({
    statut : true,
    data : "Logged Out"
  });
});

/* réinitialise un mot de passe si oublie /!\ renvoie en email */
module.exports.passwordForgot = catchErr(async ( req, res, next) =>{
  if(!req.fields.email){
    return res.status(406).json(errorNormaliser(406))
  }
  let user = await User.selectUser({Email : req.fields.email});

  if(user[0] == false){
    return res.status(user[1]).json(errorNormaliser(user[1]))
  } 

  let newPassword = () =>{
    let tab = "";
    for(let i = 0; i < 16; i++){
      tab += String.fromCodePoint(Math.floor(Math.random()*(125-33)+33));
    }
    return tab;
  };

  let resetPass = newPassword()

  await sendEmail({
    AdressEmail : req.fields.email,
    subjectEmail : "Password reset",
    textEmail : `your password has been reset by a request.\nYour new password is: ${resetPass}\nIf you are not the source of this request, please contact our customer service department as soon as possible.`
  });

  await User.updateUser({password : resetPass}, {Email : req.fields.email});

  return res.status(200).json({
    statut: true
  });
});

/* Récupère les information d'un user */
module.exports.getUser = catchErr(async (req, res, next) =>{
  let user = await User.selectUser({ ID : req.UserID});

  if(user[0] == false){
    return res.status(user[1]).json(errorNormaliser(user[1]))
  }

  return res.status(200).json({
    statut : true,
    data : user
  });
});