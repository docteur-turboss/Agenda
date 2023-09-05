const { ErrorException } = require('../models/error.models');

module.exports = (err, req, res, next) =>{
  if(err instanceof ErrorException){
    return res.status(err.status).json({
        status : false,
        errCode : err.status, 
        errMess : err.title,
        reason : err.reason
    })
  }else{
    console.log("Alerte :\nUnknow ERROR;")
    console.log("Error executed in : " + req.path)
    console.log(err)
    return res.status(500).json({
        status : false,
        errCode : 500,
        errMess : "Internal Error"
    })
  }
}