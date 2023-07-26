const task_organisation = require("../models/taskEvent.models");
let catchErr = require("../middlewares/catchAsyncErrors");
let categoryModel = require("../models/category.models");

module.exports.CreateCategory = catchErr(async (req, res, next) => {
  let catInfo = await categoryModel.createCategory({
    color: req.fields.color,
    Name: req.fields.Name,
    Organisation_ID: req.fields.OrganisationID,
  });

  if (catInfo[0] == false) {
    return res.status(catInfo[1]).json(normaliseErr(catInfo[1], catInfo[2]));
  }

  return res.status(200).json({
    status: true,
    id : catInfo.id
  });
});

module.exports.SelectCategory = catchErr(async (req, res, next) => {
  let catInfo = await categoryModel.selectCategory({
    Organisation_ID: req.fields.OrganisationID,
  });

  if (catInfo[0] == false) {
    return res.status(catInfo[1]).json(normaliseErr(catInfo[1], catInfo[2]));
  }

  return res.status(200).json({
    status: true,
    data: catInfo,
  });
});

module.exports.UpdateCategory = catchErr(async (req, res, next) => {
  let catInfo = await categoryModel.updateCategory(
    { color: req.fields.color, Name: req.fields.Name },
    { OrganisationID: req.fields.OrganisationID, id : req.fields.Category_ID }
  );

  if (catInfo[0] == false) {
    return res.status(catInfo[1]).json(normaliseErr(catInfo[1], catInfo[2]));
  }

  return res.status(200).json({
    status: true,
  });
});

module.exports.DeleteCategory = catchErr(async (req, res, next) => {
  let task = await task_organisation.destroyTask({
    category_event_ID: req.fields.Category_ID,
  });

  if (task[0] == false && task[1] !== 404) {
    return res.status(task[1]).json(normaliseErr(task[1], task[2]));
  }

  let catInfo = await categoryModel.destroyCategory({
    ID_Cat: req.fields.Category_ID,
  });

  if (catInfo[0] == false) {
    return res.status(catInfo[1]).json(normaliseErr(catInfo[1], catInfo[2]));
  }

  return res.status(200).json({
    status: true,
  });
});
