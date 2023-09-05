const { ErrorException, errorCode } = require("../models/error.models");
let taskModel = require("../models/taskEvent.models");

module.exports.CreateTask = async (req, res, next) => {
  try {
    let taskCreate = await taskModel.createTask({
      name: req.fields.name,
      category_event_ID: req.fields.category_event_ID,
      Organisation_ID: req.fields.OrganisationID,
      Datetime: req.fields.Datetime,
      OuCa: req.fields.OuCa,
    });

    if (taskCreate.success == false)
      return next(new ErrorException(taskCreate.code, taskCreate.reason));

    return res.status(201).json(taskCreate);
  } catch (err) {
    console.log(
      "CREATE TASK (backend/controllers/task.controllers.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.getTask = async (req, res, next) => {
  try {
    if (
      !req.fields.ID &&
      !req.fields.OrganisationID &&
      !req.fields.category_event_ID
    )
      return next(
        new ErrorException(
          errorCode.NotAcceptable,
          "Aucune information n'a été fournit."
        )
      );

    let taskSelect = await taskModel.selectTask({
      ID: req.fields.ID,
      Organisation_ID: req.fields.OrganisationID,
      category_event_ID: req.fields.category_event_ID,
    });

    if (taskSelect.success == false)
      return next(new ErrorException(taskSelect.code, taskSelect.reason));

    return res.status(200).json(taskSelect);
  } catch (err) {
    console.log(
      "GET TASK (backend/controllers/task.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.UpdateTask = async (req, res, next) => {
  try {
    let taskUpdate = await taskModel.updateTask(
      {
        name: req.fields.name,
        category_event_ID: req.fields.category_event_ID,
        Datetime: req.fields.Datetime,
        OuCa: req.fields.OuCa,
      },
      { ID: req.fields.ID_Task }
    );

    if (taskUpdate.success == false)
      return next(new ErrorException(taskUpdate.code, taskUpdate.reason));

    return res.status(201).json(taskUpdate);
  } catch (err) {
    console.log(
      "UPDATE TASK (backend/controllers/task.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};

module.exports.destroyTask = async (req, res, next) => {
  try {
    let dest = await taskModel.destroyTask({ ID: req.fields.ID });

    if (dest.success == false)
      return next(new ErrorException(dest.code, dest.reason));

    return res.status(200).json(dest);
  } catch (err) {
    console.log(
      "DESTROY TASK (backend/controllers/task.controller.js) HAS ERROR :"
    );
    console.log(err);

    return next(new ErrorException());
  }
};