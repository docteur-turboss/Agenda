const taskModel = require("../models/taskEvent.models");
const permissionModel = require("../models/permission.models");
let agendaModel = require("../models/organisation.models");
const categoryModel = require("../models/category.models");
const { ErrorException, errorCode } = require("../models/error.models");

module.exports.CreationAgenda = async (req, res, next) => {
  try {
    let agendaInfo = await agendaModel.createAgenda({
      Nom: req.fields.Nom,
      Type: req.fields.Type,
      idOwner: req.UserID,
    });

    if (agendaInfo.success == false)
      return next(new ErrorException(agendaInfo.code, agendaInfo.reason));

    return res.status(201).json(agendaInfo);
  } catch (err) {
    console.log(
      "CREATE AGENDA (backend/controllers/organisation.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.getAgenda = async (req, res, next) => {
  try {
    let orgaSelect = await agendaModel.selectAgenda({ ID: req.fields.OrganisationID });

    if (orgaSelect.success == false)
      return next(new ErrorException(orgaSelect.code, orgaSelect.reason));

    return res.status(200).json(orgaSelect);
  } catch (err) {
    console.log(
      "SELECT AGENDA (backend/controllers/organisation.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.updateAgenda = async (req, res, next) => {
  try {
    if (!req.fields.Nom || !req.fields.OrganisationID)
      return next(
        new ErrorException(errorCode.NotAcceptable, "Aucun parametre entré")
      );

    let agendaInfo = await agendaModel.selectAgenda({ ID: req.fields.OrganisationID });
    if (agendaInfo.selectAgenda == false)
      return next(new ErrorException(agendaInfo.code, agendaInfo.reason));

    let agendaData = await agendaModel.updateAgenda(
      { Nom: req.fields.Nom },
      { ID: req.fields.OrganisationID }
    );

    if (agendaData.success == false)
      return next(new ErrorException(agendaData.code, agendaData.reason));

    res.status(201).json(agendaData);
  } catch (err) {
    console.log(
      "UPDATE AGENDA (backend/controllers/organisation.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.DeleteAgenda = async (req, res, next) => {
  try {
    let dataAgenda = await agendaModel.selectAgenda({
      ID: req.fields.OrganisationID,
    });

    if (dataAgenda.success == false)
      return next(new ErrorException(dataAgenda.code, dataAgenda.reason));

    let dataTask = await taskModel.destroyTask({
      Agenda_ID: req.fields.Organisation_ID,
    });
    if (dataTask.success == false && dataTask.code !== errorCode.NotFound)
      return next(new ErrorException(dataTask.code, dataTask.reason));

    let dataCategory = await categoryModel.destroyCategory({
      Organisation_ID : req.fields.OrganisationID,
    });
    if (
      dataCategory.success == false &&
      dataCategory.code !== errorCode.NotFound
    )
      return next(new ErrorException(dataCategory.code, dataCategory.reason));

      let dataPerm = await permissionModel.destroyPerm({
      Organisation_ID: req.fields.OrganisationID,
    });
    if (dataPerm.success == false && dataPerm.code !== errorCode.NotFound)
      return next(new ErrorException(dataPerm.code, dataPerm.reason));

    let DestroyInfo = await agendaModel.destroyAgenda({
      ID: req.fields.OrganisationID,
    });
    if (DestroyInfo.success == false)
      return next(new ErrorException(DestroyInfo.code, DestroyInfo.reason));
    
    return res.status(200).json(DestroyInfo);
  } catch (err) {
    console.log(
      "DESTROY AGENDA (backend/controllers/organisation.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};
