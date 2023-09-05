const { ErrorException, errorCode } = require("../models/error.models");
let categoryModel = require("../models/category.models");
const taskModel = require("../models/taskEvent.models");

module.exports.CreateCategory = async (req, res, next) => {
  try{
    let catCreate = await categoryModel.createCategory({
      color: req.fields.color,
      Name: req.fields.Name,
      Organisation_ID: req.fields.OrganisationID,
    });
   
    if (catCreate.success == false) return next(new ErrorException(catCreate.code, catCreate.reason))
  
    return res.status(200).json(catCreate);
  }catch(err){
    console.log("CREATE CATEGORY (backend/controllers/category.controllers.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.getCategory = async (req, res, next) => {
  try{
    let catSelect = await categoryModel.selectCategory({
      Organisation_ID: req.fields.OrganisationID,
    });
  
    if (catSelect.success == false) return next(new ErrorException(catSelect.code, catSelect.reason))
  
    return res.status(200).json(catSelect);
  }catch(err){
    console.log("GET CATEGORY (backend/controllers/category.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.UpdateCategory = async (req, res, next) => {
  try{
    let catInfo = await categoryModel.updateCategory(
      { color: req.fields.color, Name: req.fields.Name },
      { OrganisationID: req.fields.OrganisationID, id : req.fields.Category_ID }
    );
  
    if (catInfo.success == false) return next(new ErrorException(catInfo.code, catInfo.reason))
  
    return res.status(200).json(catInfo);
  }catch(err){
    console.log("UPDATE CATEGORY (backend/controllers/task.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};

module.exports.DeleteCategory = async (req, res, next) => {
  try{
    let task = await taskModel.destroyTask({
      category_event_ID: req.fields.Category_ID,
    });
    if (task.success == false && task.code !== errorCode.NotFound) return next(new ErrorException(task.code, task.reason))

    let catInfo = await categoryModel.destroyCategory({
      id: req.fields.Category_ID,
    });
    if (catInfo.success == false) return next(new ErrorException(catInfo.code, catInfo.reason))

    return res.status(200).json(catInfo);
  }catch(err){
    console.log("DESTROY CATEGORY (backend/controllers/task.controller.js) HAS ERROR :")
    console.log(err)

    return next(new ErrorException())
  }
};