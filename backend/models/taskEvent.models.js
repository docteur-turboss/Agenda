const { errorCode } = require("./error.models");
const suppNotUsed = require("../utils/deleteParamsNotUsed");
const db = require("../config/db");
const getDB = require('../utils/VerifTable')

module.exports = class task_organisation {
  static createTask = async (
    orgaInformationToUp = {
      name: "",
      category_event_ID,
      Organisation_ID,
      Datetime,
      OuCa,
    }
  ) => {
    try {
      let taskObj = await task_organisation.modelNormilizer(
        orgaInformationToUp,
        true
      );
      if (taskObj.success == false) return taskObj;

      let taskID = await db("task_event").insert(taskObj, ["ID"]);

      return {
        success: true,
        data: {
          id: taskID[0],
          commentaire: "Tâche bien créée",
        },
      };
    } catch (err) {
      console.log(
        "CREATE TASK (backend/models/taskEvent.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  };

  static async updateTask(
    orgaInformationToUp = {
      name: "",
      category_event_ID,
      Datetime,
      OuCa,
    },
    condition = { ID }
  ) {
    try {
      let taskObj = await task_organisation.modelNormilizer(
        orgaInformationToUp
      );
      if (taskObj.success == false) return taskObj;

      let taskId = await db("task_event")
        .update(taskObj, ["ID"])
        .where(condition);

      return {
        success: true,
        data: {
          id: taskId[0],
          commentaire: "Tâche bien modifié.",
        },
      };
    } catch (err) {
      console.log(
        "UPDATE TASK (backend/models/taskEvent.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async destroyTask(
    condition = { ID, category_event_ID, Organisation_ID }
  ) {
    try {
      condition = suppNotUsed(condition);
      if (Object.keys(condition).length == 0)
        return {
          success: false,
          reason: "Certaines informations obligatoires sont manquantes.",
          code: errorCode.NotAcceptable,
        };

      let taskSelect = await task_organisation.selectTask(condition);

      if (taskSelect.success == false) return taskSelect;

      let taskId = await db("task_event").where(condition).del(["ID"]);

      return {
        success: true,
        data: {
          id: taskId[0],
          commentaire: "Tache bien détruite.",
        },
      };
    } catch (err) {
      console.log("DESTROY TASK (backend/models/taskEvent.models.js) HAS ERROR :");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async selectTask(
    condition = {
      ID: undefined,
      Organisation_ID: undefined,
      category_event_ID: undefined,
    }
  ) {
    try {
      condition = suppNotUsed(condition);

      let taskInfo = await db("task_event").select("*").where(condition);

      if (taskInfo[0] == undefined)
        return {
          success: false,
          reason: "Organisation introuvable.",
          code: errorCode.NotFound,
        };

      return {
        success: true,
        data: {
          tasks: taskInfo,
        },
      };
    } catch (err) {
      console.log(
        "SELECT TASK (backend/models/taskEvent.models.js) HAS ERROR : "
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static modelNormilizer = async (
    info = {
      name: undefined,
      category_event_ID,
      Organisation_ID,
      Datetime,
      OuCa,
    },
    obligatoire = false
  ) => {
    if (
      obligatoire &&
      (!info.name || !info.category_event_ID || !info.Organisation_ID)
    ) {
      return {
        success: false,
        reason: "Certaines informations obligatoires sont manquantes.",
        code: errorCode.NotAcceptable,
      };
    }

    if (info.name && (info.name.length < 4 || info.name.length > 50))
      return {
        success: false,
        reason: "Le nom ne doit pas être plus petit que 4 ou plus grand que 50.",
        code: errorCode.NotAcceptable,
      };

    if (info.OuCa && info.OuCa.length > 250)
      return {
        success: false,
        reason: "L'adresse ne doit pas être suppérieur à 250 caractère.",
        code: errorCode.NotAcceptable,
      };

    if (info.Datetime){
        if(isNaN(parseInt(info.Datetime)))
            return {
                success: false,
                reason: "La date n'est pas acceptable.",
                code: errorCode.NotAcceptable,
            };
    }

    if (info.category_event_ID) {
        let cat = getDB("category_event", info.category_event_ID)
        if (cat.success == false) return cat
    }

    if (info.Organisation_ID) {
        let orga = getDB('organisation', info.Organisation_ID)
        if (orga.success == false) return orga
    }

    return suppNotUsed(info);
  };
};