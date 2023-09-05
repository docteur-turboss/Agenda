const modelsError = require('../models/error.models')

module.exports = (validAuth = {token, CookieSecure}, res, next) => {
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

        res.status(200).json({
            success : true, 
            data : {
                token : validAuth.token
            }
        })
    }catch(err){ 
        console.log("TOKEN (backend/utils/token) HAS ERROR : ")
        console.log(err)
        
        next(new modelsError.ErrorException())
    }
};