const { ErrorException, errorCode } = require("../models/error.models");
let permModel = require("../models/permission.models");

module.exports.CreatePerm = async (req, res, next) => {
  try {
    let permCreate = await permModel.createPerm({
      User_ID: req.fields.UserID,
      Organisation_ID: req.fields.OrganisationID,
      Permission: req.fields.TypePerm,
    });

    if (permCreate.success == false)
      return next(new ErrorException(permCreate.code, permCreate.reason));

    return res.status(201).json(permCreate);
  } catch (err) {
    console.log(
      "CREATE PERM (backend/controllers/permission.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.UpdatePerm = async (req, res, next) => {
  try {
    let permUp = await permModel.updatePerm(
      { Permission: req.fields.TypePerm },
      { User_ID: req.fields.UserID, Organisation_ID: req.fields.OrganisationID }
    );

    if (permUp.success == false)
      return next(new ErrorException(permUp.code, permUp.reason));

    return res.status(201).json(permUp);
  } catch (err) {
    console.log(
      "UPDATE PERM (backend/controllers/permission.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.DeletePerm = async (req, res, next) => {
  try {
    if (req.UserID === req.fields.UserID)
      return next(
        new ErrorException(errorCode.NotAcceptable, "Aucun argument fournit.")
      );

    let perm = await permModel.destroyPerm({
      Organisation_ID: req.fields.OrganisationID,
      User_ID: req.fields.UserID,
    });

    if (perm.success == false)
      return next(new ErrorException(perm.code, perm.reason));

    return res.status(200).json(perm);
  } catch (err) {
    console.log(
      "DELETE PERM (backend/controller/ermission.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};
