const normaliserError = require("./errorNormaliser");

module.exports = (validAuth = {token, CookieSecure}, statusCode, res) => { 
    // à refaire
    try{
        /* options for cookie */
        const options = {
            httpOnly: true,
            secure : true
        };

        /* on crée le cookie du confirm */
        res.status(statusCode).cookie('secureCookie', validAuth.CookieSecure, options)

        /* on crée le confirm auth */
        res.status(statusCode).json({
            token : validAuth.token
        })
    }catch(err){
        res.status(500).json(normaliserError(500))
    }
};