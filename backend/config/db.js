const knex = require('knex')
require('dotenv').config({path : './config/.env'})

const configs = {
  development: {
    client: "mysql2",
    connection: {
      host : process.env.HOSTDB,
      port: process.env.PORTDB,
      user : process.env.USERDB,
      password: process.env.PASSWORDDB,
      database : process.env.Database,
    },
    pool : {min : 0, max: 7},
    log: {
      warn(message) {
      },
      error(message) {
      },
      deprecate(message) {
      },
      debug(message) {
      },
    }
  },
  staging: {
    client: "mysql2",
    connection: {
      host : process.env.HOSTDB,
      port: process.env.PORTDB,
      user : process.env.USERDB,
      password: process.env.PASSWORDDB,
      database : process.env.Database,
    },
    pool : {min : 0, max: 7},
    log: {
      warn(message) {
      },
      error(message) {
      },
      deprecate(message) {
      },
      debug(message) {
      },
    }
  },
  production: {
    client: "mysql2",
    connection: {
      host : process.env.HOSTDB,
      port: process.env.PORTDB,
      user : process.env.USERDB,
      password: process.env.PASSWORDDB,
      database : process.env.Database,
    },
    pool : {min : 0, max: 7},
    log: {
      warn(message) {
      },
      error(message) {
      },
      deprecate(message) {
      },
      debug(message) {
      },
    }
  }
}

const config = configs[process.env.NODE_ENV || 'development'];

const db = knex(config);

module.exports = db;