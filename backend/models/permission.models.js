const { errorCode } = require("./error.models");
const suppNotUsed = require("../utils/deleteParamsNotUsed");
const db = require("../config/db");
const getDB = require('../utils/VerifTable')

module.exports = class permission {
  static createPerm = async (
    orgaInformationToUp = { User_ID, Organisation_ID, Permission }
  ) => {
    try {
      let permObj = await permission.modelNormilizer(orgaInformationToUp);
      if (permObj.success == false) return infoPerm;

      let permID = await db("user_has_organisation").insert(permObj, ["ID"]);

      return {
        success: true,
        data: {
          id: permID[0],
          commentaire: "Permission bien créée",
        },
      };
    } catch (err) {
      console.log(
        "CREATE PERM (backend/models/permission.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: codeE.UnknownError,
      };
    }
  };

  static async updatePerm(
    orgaInformationToUp = { Permission },
    condition = { User_ID, Organisation_ID }
  ) {
    try {
      let permObj = await permission.modelNormilizer(
        orgaInformationToUp,
        condition
      );
      if (permObj.success == false) return permObj;

      let permId = await db("user_has_organisation")
        .update(permObj, ["ID"])
        .where(condition);

      return {
        success: true,
        data: {
          id: permId[0],
          commentaire: "Permission bien modifié.",
        },
      };
    } catch (err) {
      console.log(
        "UPDATE PERM (backend/models/permission.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: codeE.UnknownError,
      };
    }
  }

  static async destroyPerm(condition = { User_ID, Organisation_ID }) {
    try{
        if (!condition.Organisation_ID) return {
            success : false,
            reason : "Certaines informations obligatoires sont manquantes.",
            code : errorCode.NotAcceptable
        }
    
        condition = suppNotUsed(condition);
    
        let permSelect = await permission.selectPerm(condition);
    
        if (permSelect.success == false) return permInfo;
    
        let permId = await db("user_has_organisation").where(condition).del(['ID']);
    
        return {
            success : true,
            data : {
                id : permId[0],
                commentaire : "Permission bien détruite."
            }
        };
    }catch(err){
        console.log("DESTROY PERMISSION (backend/models/permission.models.js) HAS ERROR :")
        console.log(err)

        return {
            success : false,
            code : errorCode.UnknownError
        }
    }
  }

  static async selectPerm(
    condition = { User_ID: undefined, Organisation_ID: undefined }
  ) {
    try{
        condition = suppNotUsed(condition);

        let permInfo = await db("user_has_organisation")
        .select("Permission")
        .where(condition);

        if (permInfo[0] == undefined) {
            return {
                success : false,
                reason : "Permission introuvable.",
                code : errorCode.NotFound
            }
        }

        return {
            success : true,
            data : {
                perms : permInfo
            }
        };
    }catch(err){
        console.log(
            "SELECT PERM (backend/models/permission.models.js) HAS ERROR : "
          );
          console.log(err);
    
          return {
            success: false,
            code: errorCode.UnknownError,
          };
    }
  }

  static modelNormilizer = async (
    info = { User_ID, Organisation_ID, Permission },
    obligatoire = false
  ) => {
    if (obligatoire == true || !info.Permission && (!info.User_ID || !info.Organisation_ID))
        return {
            success : false,
            code : errorCode.NotAcceptable,
            reason : "Certaines informations obligatoires sont manquantes."
        };

    if (info.User_ID) {
      let user = getDB("user", info.User_ID);
      if (user.success == false) return user;
    }

    if (info.Organisation_ID) {
      let orgo = getDB("organisation", info.Organisation_ID);
      if (orgo.success == false) return orgo;
    }

    return suppNotUsed(info);
  };
}