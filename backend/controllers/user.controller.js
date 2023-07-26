const suppNotUsed = require("../utils/deleteParamsNotUsed");
let catchErr = require("../middlewares/catchAsyncErrors");
let User = require("../models/user.models");
let sendToken = require("../utils/token");
let sendEmail = require("../utils/email");
const { scryptSync } = require("crypto");
const { hashSync } = require("bcryptjs");
let fs = require("fs");


/*Enregistre l'user*/
module.exports.signup = catchErr(async (req, res, next) => {
  let NewUser = await User.createUser({
    Pseudo: req.fields.pseudo,
    Email: req.fields.email,
    password: hashSync(scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex'), 10)
  });

  if (NewUser.success == false) {
    throw new Error()
  }

  let CookieSecure = await User.createSecurityAuth(NewUser);

  if(CookieSecure.success == false){
    return res.status(CookieSecure.status).json(errorNormaliser(CookieSecure.status, CookieSecure.message))
  }

  return sendToken(
    { token: CookieSecure.data.token, CookieSecure: CookieSecure.data.cookieSecure },
    CookieSecure.status,
    res
  );
});

/* Détruit l'user */
module.exports.deleteUser = catchErr(async (req, res, next) => {
  let user = await User.selectUser({ ID: req.UserID });

  if (user[0] == false) {
    return res.status(user[1]).json(errorNormaliser(user[1], user[2]));
  }

  let DesUser = await User.destroyUser({ ID: req.UserID });

  if(DesUser[0] == false){
    return res.status(DesUser[1]).json(DesUser[1], DesUser[2])
  }

  res.clearCookie("secureCookie");

  return res.status(200).json({
    status: true,
    data: 'Utilisateur bien détruit.'
  });
});

/* modification d'un utilisateur lambda */
module.exports.updateProfile = catchErr(async (req, res, next_) => {
  if (!req.fields.pseudo && !req.fields.email && !req.fields.password) {
    return res.status(406).json(errorNormaliser(406, 'Aucune information fourni.'));
  }

  let user = await User.selectUser({ ID: req.UserID });

  if (user[0] == false) {
    return res.status(user[1]).json(errorNormaliser(user[1], user[2]));
  }

  let updateUsed = {
    Email : req.fields.email,
    Pseudo : req.fields.pseudo,
    password: hashSync(scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex'), 10)
  };

  updateUsed = suppNotUsed(updateUsed)

  let updaUser = await User.updateUser(updateUsed, { ID: req.UserID });

  if(updaUser[0] == false){
    return res.status(updaUser[1]).json(errorNormaliser(updaUser[1], updaUser[2]))
  }

  if (req.fields.password) {
    let CookiesSecure = await User.createSecurityAuth(req.UserID);

    if(CookiesSecure[0] == false){
      return res.status(CookiesSecure[1]).json(errorNormaliser(CookiesSecure[1], CookiesSecure[2]))
    }

    return sendToken(
      { token: CookiesSecure.data.token, CookieSecure: CookiesSecure.data.cookieSecure },
      CookiesSecure.status,
      res
    );
  }
  return res.status(201).json({
    status: true,
  });
});

/* connecte un utilisateur */
module.exports.login = catchErr(async (req, res, next) => {
  if (!req.fields.email || !req.fields.password) {
    return res.status(401).json(errorNormaliser(401, "Email ou Mot de passe invalide."));
  }

  let informationPass = await User.comparePassword(
    req.fields.email,
    scryptSync(req.fields.password, 'BonsourCetaitUnTest,RetireEnProdSTP.', 24, { N: 1024 }).toString('hex')
    );

  if (informationPass[0] == false) {
    return res.status(informationPass[1]).json(errorNormaliser(informationPass[1], informationPass[2]));
  }

  return sendToken(informationPass.data, informationPass.status, res);
});

/* disconnect un user */
module.exports.logout = catchErr(async (req, res, next) => {
  res.clearCookie("secureCookie");

  return res.status(200).json({
    status: true,
    data: "Utilisateur bien déconnecté.",
  });
});

/* réinitialise un mot de passe si oublie /!\ renvoie en email */
module.exports.passwordForgot = catchErr(async (req, res, next) => {
  if (!req.fields.email) {
    return res.status(406).json(errorNormaliser(406, "Pas d'email fournit."));
  }
  let user = await User.selectUser({ Email: req.fields.email });

  if (user[0] == false) {
    return res.status(user[1]).json(errorNormaliser(user[1], user[2]));
  }

  let resetPass = Math.random().toString(36).substring(2,13);

  await sendEmail({
    AdressEmail: req.fields.email,
    subjectEmail: "Password reset",
    textEmail: `your password has been reset by a request.\nYour new password is: ${resetPass}\nIf you are not the source of this request, please contact our customer service department as soon as possible.`,
  });

  await User.updateUser({ password: resetPass }, { Email: req.fields.email });

  return res.status(200).json({
    status: true,
    data: "Mot de passe réinitialisé."
  });
});

/* Récupère les information d'un user */
module.exports.getUser = catchErr(async (req, res, next) => {
  let user = await User.selectUser({ ID: req.UserID });

  if (user[0] == false) {
    return res.status(user[1]).json(errorNormaliser(user[1], user[2]));
  }

  return res.status(200).json({
    status: true,
    data: user[0],
  });
});
