const {ErrorException, errorCode} = require('../models/error.models');
const ExRateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

let generalConfig = {
  handler: (req, res, next, options) => next(new ErrorException(errorCode.ToManyRequest, options.message)),
  keyGenerator : (req, res) => uuidv4(),
  message : "Trop de requêtes, veuillez réessayer plus tard.",
  windowMs: 60000 * 60 /* (1 heure) */
};

let exporterFast = (nameExport, limit) => module.exports[nameExport] = ExRateLimit.rateLimit({...generalConfig, max : limit});

exporterFast("limiterUser", 5);
exporterFast("limiterTask", 1000);
exporterFast("limiterCategory", 500);
exporterFast("limiterOrganisation", 50);