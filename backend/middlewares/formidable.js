const formidable = require('formidable')
const path = require('path')

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
      return next({status : false, errMess : err });
    }
    
    req.fields = fields;
    req.files = files;
    next();
  });
};

/*
   form.on('field', function(field, value) {
                console.log(field, value);
                fields.push([field, value]);
            })
            .on ('fileBegin', function(name, file){
              var fileType = file.type.split('/').pop();
              if(fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' ){
                  //rename the incoming file
                  file.path = form.uploadDir + "/" + images_hash + '_' + image_count + '.' + fileType;
                  //increment image counter for next possible incoming image
                  ++image_count;
              } else {
                  console.log( 'incorrect file type: ' + fileType );
              }
          })
*/
