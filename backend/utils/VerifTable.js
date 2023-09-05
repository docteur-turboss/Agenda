let db = require('../config/db')

module.exports = getDB = async (DBtable, params) => {
  let dbInfo = await db(DBtable).select("ID").where({ ID: params });

    dbInfo = await dbInfo[0];

    if (dbInfo == undefined) return {
      success : false,
      code : errorCode.NotFound
    }
  }