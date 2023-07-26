let catchErr = require("../middlewares/catchAsyncErrors");
let permModel = require("../models/permission.models");

module.exports.CreatePerm = catchErr(async (req, res, next) => {
  let perm = await permModel.createPerm({
    User_ID: req.fields.UserID,
    Organisation_ID: req.fields.OrganisationID,
    Permission: req.fields.TypePerm,
  });

  if (perm[0] == false) {
    return res.status(perm[1]).json(normaliseErr(perm[1], perm[2]));
  }

  return res.status(201).json({
    status: true,
  });
});

module.exports.UpdatePerm = catchErr(async (req, res, next) => {
  let perm = await permModel.updatePerm(
    { Permission: req.fields.TypePerm },
    { User_ID: req.fields.UserID, Organisation_ID: req.fields.OrganisationID }
  );

  if (perm[0] == false) {
    return res.status(perm[1]).json(normaliseErr(perm[1], perm[2]));
  }

  return res.status(201).json({
    status: true,
  });
});

module.exports.DeletePerm = catchErr(async (req, res, next) => {
  if (req.UserID === req.fields.UserID) {
    return res.status(403).json(normaliseErr(403, "No valid paramName provided"));
  }
  let perm = await permModel.destroyPerm({
    Organisation_ID: req.fields.OrganisationID,
    User_ID: req.fields.UserID,
  });

  if (perm[0] == false) {
    return res.status(perm[1]).json(normaliseErr(perm[1], perm[2]));
  }

  return res.status(200).json({
    status: true,
  });
});
