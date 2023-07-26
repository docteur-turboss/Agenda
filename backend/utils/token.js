const modelsError = require('../models/error.models')

module.exports = (validAuth = {token, CookieSecure}, statusCode, res, next) => { 
    // à refaire
    try{
        /* options for cookie */
        const options = {
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: true
        };

        /* on crée le cookie du confirm */
        res.cookie('auth', validAuth.CookieSecure, options)

        /* on crée le confirm auth */
        res.status(statusCode).json({
            token : validAuth.token
        })
    }catch(err){
        next(new modelsError.ErrorException())
    }
};