const {ErrorException, errorCode} = require('../models/error.models')
let UserModel = require("../models/user.models");
let sendToken = require("../utils/token");
let sendEmail = require("../utils/email");
const { scryptSync } = require("crypto");
const { hashSync } = require("bcryptjs");

module.exports.signup = async (req, res, next) => {
  try{
    let userCreate = await UserModel.createUser({
      Pseudo: req.fields.pseudo,
      Email: req.fields.email,
      password: hashSync(scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex'), 10)
    });

    if (userCreate.success == false) return next(new ErrorException(userCreate.code, userCreate.reason))

    let CookieSecure = await UserModel.createSecurityAuth(userCreate.data.id);
    if(CookieSecure.success == false){
      return next(new ErrorException(CookieSecure.code, CookieSecure.reason))
    }

    return sendToken(
      { token: CookieSecure.data.token, CookieSecure: CookieSecure.data.cookieSecure },
      res,
      next
    );
  }catch(err){
    console.log("SIGN UP (backend/controllers/user.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.getUser = async (req, res, next) => {
  try{
    let userSelect = await UserModel.selectUser({ ID: req.UserID });
    if (userSelect.success == false) return next(new ErrorException(userSelect.code, userSelect.reason))
  
    return res.status(200).json(userSelect);    
  }catch(err){
    console.log("GET USER (backend/controller/user.controller.js) HAS ERROR")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try{
    if (!req.fields.pseudo && !req.fields.email && !req.fields.password) {
      return next(new ErrorException(errorCode.NotAcceptable, 'Aucune information fourni.'));
    }
  
    let user = await UserModel.selectUser({ ID: req.UserID });
    if (user.success == false) return next(new ErrorException(user.code, user.reason))
  
    let updateUsed = {
      Email : req.fields.email,
      Pseudo : req.fields.pseudo,
      password: hashSync(scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex'), 10)
    };

    let updaUser = await UserModel.updateUser(updateUsed, { ID: req.UserID });
    if(updaUser.success == false){
      return next(new ErrorException(updaUser.code, updaUser.reason))
    }
  
    if (req.fields.password) {
      let CookiesSecure = await UserModel.createSecurityAuth(req.UserID);
      if(CookiesSecure.success == false) return next(new ErrorException(CookiesSecure.code, CookiesSecure.reason))
  
      return sendToken(
        { token: CookiesSecure.data.token, CookieSecure: CookiesSecure.data.cookieSecure },
        res
      );
    }

    return res.status(201).json(updaUser);
  }catch(err){
    console.log("UPDATE PROFILE (backend/controllers/user.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try{
    let DesUser = await UserModel.destroyUser({ ID: req.UserID });
    if(DesUser.success == false){
      return next(new ErrorException(DesUser.code, DesUser.reason))
    }

    res.clearCookie("secureCookie");
    return res.status(200).json(DesUser);
  }catch(err){
    console.log("DELETE (backend/controllers/user.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.login = async (req, res, next) => {
  try{    
    let informationPass = await UserModel.comparePassword(
      req.fields.email,
      scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex')
    );
  
    if (informationPass.success == false) {
      return next(new ErrorException(informationPass.code, informationPass.reason))
    }
  
    return sendToken({CookieSecure : informationPass.data.auth.CookieSecure, token : informationPass.data.auth.token}, res);
  }catch(err){
    console.log("LOGIN (backend/controllers/user.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.logout = async (req, res, next) => {
  try{
    res.clearCookie("auth");

    return res.status(200).json({
      status: true,
      data: {
        commentaire : "Utilisateur bien déconnecté."
      },
    });
  }catch(err){
    console.log("LOGOUT (backend/controllers/user.controllers.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

/* réinitialise un mot de passe si oublie /!\ le renvoie uniquement en email */
module.exports.passwordForgot = async (req, res, next) => {
  try{
    if (!req.fields.email) {
      return next(new ErrorException(errorCode.NotAcceptable,"Pas d'email fournit."));
    }
  
    let user = await User.selectUser({ Email: req.fields.email });
    let resetPass = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
    if (user.success == false) {
      return next(new ErrorException(user.code, user.reason))
    }
    let sendResponse = await sendEmail({
      AdressEmail: req.fields.email,
      subjectEmail: "Réinitialisation du mot de passe",
      textEmail: `votre mot de passe a été réinitialisé à votre demande.\nVotre nouveau mot de passe est:\n${resetPass}\nSi vous n'êtes pas à l'origine de cette demande, veuillez contacter notre support technique le plus rapidement possible.\n\nBonne journée sur Avent.\n(Message automatique, merci de ne pas répondre)`,
    });
    if(sendResponse.status == false) return next(new ErrorException())

    let updaUser = await User.updateUser({ password: resetPass }, { Email: req.fields.email });
    if(updaUser.success == false){
      return next(new ErrorException(updaUser.code, updaUser.reason))
    }
  
    return res.status(200).json({
      status: true,
      data: {
        commentaire : "Votre mot de passe est bien réinitialisé, veuillez regarder vos mails."
      }
    });
  }catch(err){
    console.log("RESET PASSWORD (backend/controllers/user.controllers.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};