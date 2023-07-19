
const normaliserError = (errorCode) =>{
    let objresp = {statut : false, errCode : errorCode, errMess : ''};
    
    switch (errorCode) {
        case 400:
          objresp.errMess = "BAD REQUEST"
          break;
        case 401:
          objresp.errMess = "NOT AUTHORIZED"
          break;
        case 403:
          objresp.errMess = "FORBIDDEN"
          break;
        case 404:
          objresp.errMess = "NOT FOUND"
          break;
        case 405:
          objresp.errMess = "METHOD NOT ALLOWED"
          break;
        case 406:
          objresp.errMess = "NOT ACCEPTABLE"
          break;
        case 500:
          objresp.errMess = "INTERNAL SERVER ERROR"
          break;
    }
    return objresp
}

module.exports = normaliserError