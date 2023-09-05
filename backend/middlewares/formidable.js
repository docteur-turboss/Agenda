const { ErrorException } = require('../models/error.models');
const formidable = require('formidable')
const path = require('path');

module.exports = (req, res, next) => {
  const form = formidable({
      uploadDir : path.resolve(__dirname, "../../frontend/src/img/ppUser"),
      keepExtensions : true,
      maxFiles : 1,
      filter : ({mimetype}) => {
          return (mimetype && mimetype.includes("image"))? true : false
      },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log("FORMIDABLE (backend/middlewares/formidable.js) HAS ERROR :")
      console.log(err)
      
      return next(new ErrorException());
    }
    
    req.fields = fields;
    req.files = files;
    next();
  });
};