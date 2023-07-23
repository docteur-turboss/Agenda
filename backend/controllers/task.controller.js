let catchErr = require("../middlewares/catchAsyncErrors");
let normaliseErr = require("../utils/errorNormaliser");
let taskModel = require("../models/taskEvent.models");

module.exports.getTask = catchErr(async (req, res, next) => {
  if (
    !req.fields.ID &&
    !req.fields.OrganisationID &&
    !req.fields.category_event_ID
  ) {
    return res.status(405).json(normaliseErr(405, "No valid params name provided"));
  }

  let task = await taskModel.selectTask({
    ID: req.fields.ID,
    Organisation_ID: req.fields.OrganisationID,
    category_event_ID: req.fields.category_event_ID,
  });

  if (task[0] == false) {
    return res.status(task[1]).json(normaliseErr(task[1], task[2]));
  }
  return res.status(200).json({
    status: true,
    data: task,
  });
});

module.exports.CreateTask = catchErr(async (req, res, next) => {
  let taskCreate = await taskModel.createTask({
    name: req.fields.name,
    etat: 0,
    category_event_ID: req.fields.category_event_ID,
    Organisation_ID: req.fields.OrganisationID,
    desc: req.fields.desc,
    Datetime: req.fields.Datetime,
    Where: req.fields.Where,
  });

  if (taskCreate[0] == false) {
    return res.status(taskCreate[1]).json(normaliseErr(taskCreate[1], taskCreate[2]));
  }

  return res.status(201).json({
    status: true,
    id: taskCreate.id
  });
});

module.exports.UpdateTask = catchErr(async (req, res, next) => {
  let taskUpdate = await taskModel.updateTask(
    {
      name: req.fields.name,
      etat: 0,
      category_event_ID: req.fields.category_event_ID,
      desc: req.fields.desc,
      Datetime: req.fields.Datetime,
      Where: req.fields.Where,
    },
    { ID: req.fields.ID_Task }
  );

  if (taskUpdate[0] == false) {
    return res.status(taskUpdate[1]).json(normaliseErr(taskUpdate[1], taskUpdate[2]));
  }

  return res.status(201).json({
    status: true,
  });
});

module.exports.destroyTask = catchErr(async (req, res, next) => {
  if (req.fields.ID == undefined) {
    return res.status(405).json(normaliseErr(405, 'No valid params name provided'));
  }

  let dest = await taskModel.destroyTask({ ID: req.fields.ID });

  if (dest[0] == false) {
    return res.status(dest[1]).json(normaliseErr(dest[1], dest[2]));
  }

  return res.status(200).json({
    status: true,
  });
});
