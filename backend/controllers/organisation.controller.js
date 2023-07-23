const task_organisation = require("../models/taskEvent.models");
const permission = require("../models/permission.models");
let catchErr = require("../middlewares/catchAsyncErrors");
let normaliseErr = require("../utils/errorNormaliser");
let agenda = require("../models/organisation.models");
const category = require("../models/category.models");
let fs = require("fs");

/* Create Agenda */
module.exports.creationAgenda = catchErr(async (req, res, next) => {
  let agendaInfo = await agenda.createAgenda({
    Nom: req.fields.Nom,
    Type: req.fields.Type,
    idOwner: req.UserID,
  });

  if (agendaInfo[0] == false) {
    return res.status(agendaInfo[1]).json(normaliseErr(agendaInfo[1], agendaInfo[2]));
  }

  return res.status(201).json({
    status: true,
    id : agendaInfo.id
  });
});

/* Détruire un agenda */
module.exports.DeleteAgenda = catchErr(async (req, res, next) => {
  let dataAgenda = await agenda.selectAgenda({ ID: req.fields.OrganisationID });
  if (dataAgenda[0] == false) {
    return res.status(dataAgenda[1]).json(normaliseErr(dataAgenda[1], dataAgenda[2]));
  }

  let dataTask = await task_organisation.destroyTask({
    Agenda_ID: req.fields.OrganisationID,
  });
  if (dataTask[0] == false && dataTask[1] !== 404) {
    return res.status(dataTask[1]).json(normaliseErr(dataTask[1], dataTask[2]));
  }

  let dataCategory = await category.destroyCategory({
    agenda_ID: req.fields.OrganisationID,
  });

  if (dataCategory[0] == false && dataCategory[1] !== 404) {
    return res.status(dataCategory[1]).json(normaliseErr(dataCategory[1], dataCategory[2]));
  }

  let dataPerm = await permission.destroyPerm({
    Organisation_ID: req.fields.OrganisationID,
  });

  if (dataPerm[0] == false && dataPerm[1] !== 404) {
    return res.status(dataPerm[1]).json(normaliseErr(dataPerm[1], dataPerm[2]));
  }

  let DestroyInfo = await agenda.destroyAgenda({
    ID: req.fields.OrganisationID,
  });

  if (DestroyInfo[0] == false) {
    return res.status(DestroyInfo[1]).json(normaliseErr(DestroyInfo[1], DestroyInfo[2]));
  }

  return res.status(200).json({
    status: true,
  });
});

/* Modification d'un agenda */
module.exports.updateAgenda = catchErr(async (req, res, next) => {
  if (!req.fields.Nom || !req.fields.ID) {
    return res.status(406).json(normaliseErr(406, "No valid params names provided "));
  }

  let agendaInfo = await agenda.selectAgenda({ ID: req.fields.ID });
  if (agendaInfo[0] == false) {
    return res.status(agendaInfo[1]).json(normaliseErr(agendaInfo[1], agendaInfo[2]));
  }

  let agendaData = await agenda.updateAgenda(
    { Nom: req.fields.Nom },
    { ID: req.fields.ID }
  );
  if (agendaData[0] == false) {
    return res.status(agendaData[1]).json(normaliseErr(agendaData[1], agendaData[2]));
  }

  res.status(201).json({
    status: true,
  });
});

/* Récupère les informations d'un agenda */
module.exports.getAgenda = catchErr(async (req, res, next) => {
  let agendaData;
  if (req.fields.ID) {
    agendaData = await agenda.selectAgenda({ ID: req.fields.ID });
  } else {
    agendaData = await agenda.selectAgenda();
  }

  if (agendaData[0] == false) {
    return res.status(agendaData[1]).json(normaliseErr(agendaData[1], agendaData[2]));
  }

  res.status(200).json({
    status: true,
    data: agendaData,
  });
});
