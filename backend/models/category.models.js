const { errorCode } = require("./error.models");
const suppNotUsed = require("../utils/deleteParamsNotUsed");
const db = require("../config/db");
const getDB = require('../utils/VerifTable')

module.exports = class category {
  static createCategory = async (
    orgaInformationToUp = { Name, color, Organisation_ID }
  ) => {
    try {
      let catObj = await category.modelNormilizer(
        orgaInformationToUp,
        { OrganisationID: orgaInformationToUp.Organisation_ID },
        true
      );
      if (catObj.success == false) return catObj;

      let catID = await db("category_event").insert(catObj, ["id"]);

      return {
        success: true,
        data: {
          id: catID[0],
          commentaire: "Catégorie bien créée",
        },
      };
    } catch (err) {
      console.log("CREATE CATEGORY (backend/models/category.models.js) HAS ERROR :");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  };

  static async updateCategory(
    orgaInformationToUp = { Name, color },
    condition = { id }
  ) {
    try {
      let OrgaObj = await category.modelNormilizer(
        orgaInformationToUp,
        { id: condition.id }
      );
      if (OrgaObj.success == false) return OrgaObj;

      let catId = await db("category_event")
        .update(OrgaObj, ["id"])
        .where({ id: condition.id });

      return {
        success: true,
        data: {
          id: catId[0],
          commentaire: "catégorie bien modifié.",
        },
      };
    } catch (err) {
      console.log(
        "UPDATE CATEGORY (backend/models/category.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async destroyCategory(condition = { id, Organisation_ID }) {
    try {
      condition = suppNotUsed(condition);

      if (Object.keys(condition).length == 0) return {
        success: false,
        reason: "Certaines informations obligatoires sont manquantes.",
        code: errorCode.NotAcceptable,
      };

      let catSelect = await category.selectCategory(condition);
      if (catSelect.success == false) return catSelect;

      let catId = await db("category_event").where(condition).del(["id"]);

      return {
        success: true,
        data: {
          id: catId[0],
          commentaire: "Catégorie et tâche bien détruite.",
        },
      };
    } catch (err) {
      console.log("DESTROY CATEGORY (backend/models/category.models.js) HAS ERROR :");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async selectCategory(
    condition = { Organisation_ID: undefined, ID: undefined }
  ) {
    try {
      condition = suppNotUsed(condition);

      let catInfo = await db("category_event").select("*").where(condition);

      if (catInfo[0] == undefined)
        return {
          success: false,
          reason: "Organisation introuvable.",
          code: errorCode.NotFound,
        };

      return {
        success: true,
        data: {
            categorys: catInfo,
        },
      };
    } catch (err) {
      console.log(
        "SELECT CATEGORY (backend/models/category.models.js) HAS ERROR : "
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static modelNormilizer = async (
    info = { Name, color },
    id = { id, OrganisationID },
    obligatoire = false
  ) => {
    if ((!id.OrganisationID && !id.id) || (obligatoire == true && (!info.Name || !info.color || !id.OrganisationID)))
      return {
        success: false,
        code: errorCode.NotAcceptable,
        reason: "Certaines informations obligatoires sont manquantes.",
      };

    if (info.Name && (info.Name.length < 2 || info.Name.length > 100))
      return {
        success: false,
        code: errorCode.NotAcceptable,
        reason: "Le nom ne doit pas être inférieur à 2 ou suppérieur à 100.",
      };

    if (info.color && info.color.length > 8)
      return {
        success: false,
        code: errorCode.NotAcceptable,
        reason: "La couleur est invalide.",
      };

    if (id.OrganisationID) {
        let orga = getDB('organisation', id.OrganisationID)
        if (orga.success == false) return orga
    }

    if (id.id) {
        let cat = getDB('category_event', id.id)
        if (cat.success == false) return cat
    }

    return suppNotUsed(info);
  };
};