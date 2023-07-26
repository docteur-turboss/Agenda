const errorCode = {
    Unauthenticated : "Unauthenticated",
    NotFound : "NotFound",
    MaximumAllowedGrade : "MaximumAllowedGrade",
    AsyncError : "AsyncError",
    UnknownError : "UnknownError",
    NotAcceptable : "NotAcceptableError",
    Forbidden : "Forbiden"
}

module.exports.ErrorException = class ErrorException extends Error{
    constructor(code = errorCode.UnknownError, reason = null){
        super(code);
        this.status = 500;
        this.reason = reason;
        switch(code){
            case errorCode.Unauthenticated :
                this.title = "NOT AUTHORIZED";
                this.status = 401;
                break;
            case errorCode.BadRequest : 
                this.title = "BAD REQUEST";
                this.status = 400;
                break;
            case errorCode.Forbidden :
                this.title = "FORBIDDEN";
                this.status = 403;
                break;
            case errorCode.NotFound :
                this.title = "Ressource introuvable";
                this.status = 404;
                break;
            case errorCode.NotAcceptable :
                this.title = "Requêtes non acceptable";
                this.status = 406;
                break;
            default :
                this.title = "Internal error";
                this.status = 500;
                break;
        }
    }
}

module.exports.errorCode = errorCode;