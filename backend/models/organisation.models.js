const { errorCode } = require("./error.models");
const suppNotUsed = require("../utils/deleteParamsNotUsed");
const db = require("../config/db");
const permission = require("./permission.models");

module.exports = class Organisation {
  static createAgenda = async (
    orgaInformationToUp = { Nom, Type, idOwner }
  ) => {
    try {
      let orgaObj = await Organisation.modelNormilizer(
        orgaInformationToUp,
        true
      );

      if (orgaObj.success == false) return orgaObj;

      let orgaId = await db("organisation").insert(
        {
          Nom: orgaObj.Nom,
          type: orgaObj.Type,
        },
        ["ID"]
      );

      let firstPerm = await permission.createPerm({
        Organisation_ID: orgaId[0],
        Permission: "manager",
        User_ID: orgaInformationToUp.idOwner,
      });

      if (firstPerm.success == false) {
        return firstPerm;
      }

      return {
        success: true,
        data: {
          id: orgaId[0],
          commentaire: "Agenda crée",
        },
      };
    } catch (err) {
      console.log(
        "CREATE ORGANISATION (backend/models/organisation.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  };

  static async updateAgenda(orgaInformationToUp = { Nom }, condition = { ID }) {
    try {
      let OrgaInfo = await Organisation.modelNormilizer(orgaInformationToUp);

      if (OrgaInfo.success == false) return OrgaInfo;

      let orgaId = await db("organisation")
        .update(OrgaInfo, ["ID"])
        .where(condition);

      return {
        success: true,
        data: {
          id: orgaId[0],
          commentaire: "Organisation bien modifié.",
        },
      };
    } catch (err) {
      console.log(
        "UPDATE ORGANISATION (backend/models/organisation.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async destroyAgenda(condition = { ID }) {
    try {
      if (condition.ID == undefined)
        return {
          success: false,
          reason: "Certaines informations obligatoires sont manquantes.",
          code: errorCode.NotAcceptable,
        };

      let agendainfo = await Organisation.selectAgenda(condition);
      if (agendainfo.success == false) return agendainfo;

      let orgaId = await db("organisation").where(condition).del(["ID"]);

      return {
        success: true,
        data: {
          id: orgaId[0],
          commentaire: "Agenda, catégorie et tâche bien détruit.",
        },
      };
    } catch (err) {
      console.log(
        "DESTROY ORGANISATION (backend/models/organisation.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async selectAgenda(condition = { ID: undefined }) {
    try {
      condition = suppNotUsed(condition);

      let orgaInfo = await db("organisation").select("*").where(condition);

      if (orgaInfo[0] == undefined)
        return {
          success: false,
          reason: "Organisation introuvable.",
          code: errorCode.NotFound,
        };
      return {
        success: true,
        data: {
          agenda: orgaInfo,
        },
      };
    } catch (err) {
      console.log(
        "SELECT ORGANISATION (backend/models/organisation.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  /* normalise la data */
  static modelNormilizer = async (
    info = { Nom, Type: 0 },
    obligatoire = false
  ) => {
    if (obligatoire == true && !info.Nom)
      return {
        success: false,
        reason: "Certaines informations fournies sont manquantes.",
        code: errorCode.NotAcceptable,
      };

    if (info.Nom && 100 < info.Nom.length && info.Nom.length < 3)
      return {
        success: false,
        reason:
          "Le nom ne doit pas être suppérieur à 100 ou inférieur à 3 caractère.",
        code: errorCode.NotAcceptable,
      };

    if (info.Type && (info.Type < 0 || info.Type > 1))
      return {
        success: false,
        reason:
          "Merci d'éviter ce genre de manipulation. Soit agenda, soit projet, pas xyz.",
        code: errorCode.NotAcceptable,
      };
    info = suppNotUsed(info);

    return info;
  };
};
