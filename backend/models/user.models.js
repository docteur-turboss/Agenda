const { errorCode } = require("./error.models");
const suppNotUsed = require("../utils/deleteParamsNotUsed");
const db = require("../config/db");
const getDB = require('../utils/VerifTable')
const { hashSync, compare } = require("bcryptjs");
const validator = require("email-validator");
const { scryptSync } = require("crypto");

module.exports = class User {
  static async createUser(
    ModelsNormailise = {
      Pseudo,
      Email,
      password
    }
  ) {
    
    try {
      let userObj = await User.modelNormilizer(ModelsNormailise, true);
      if (userObj.success == false) return userObj;

      let userID = await db("user").insert(userObj, ["ID"]);

      return {
        success: true,
        data: {
          id: userID[0],
          commentaire: "Utilisateur bien crée",
        },
      };
    } catch (err) {
      console.log("CREATE USER (backend/models/user.models.js) HAS ERROR : ");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async updateUser(
    UserInformationToUp = { Pseudo, Email, password, Type },
    condition = { ID, Email }
  ) {
    try {
      condition = suppNotUsed(condition);

      let ObjUser = await User.modelNormilizer(UserInformationToUp);
      if (ObjUser.success == false) return ObjUser;

      let userId = await db("user").update(ObjUser, ["ID"]).where(condition);

      return {
        success: true,
        data: {
          id: userId[0],
          commentaire: "Utilisateur bien modifié.",
        },
      };
    } catch (err) {
      console.log("UPDATE USER (backend/models/user.models.js) HAS ERROR :");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async destroyUser(condition = { ID, Email }) {
    try {
      condition = suppNotUsed(condition);

      if (Object.keys(condition).length && validator.validate(condition.Email)
      )
        return {
          success: false,
          reason: "Certaines informations obligatoires sont manquantes.",
          code: errorCode.NotAcceptable,
        };

      let userSelect = await User.selectUser(condition);
      if (userSelect.success == false) return Ise;

      let userId = await db("user").where(condition).del(["ID"]);

      return {
        success: true,
        data: {
          id : userId[0],
          commentaire : "Utilisateur bien détruit."
        },
      };
    } catch (err) {
      console.log("DESTROY USER (backend/models/user.models.js) HAS ERROR :");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async selectUser(condition = { ID: undefined, Email: undefined }) {
    try {
      condition = suppNotUsed(condition);

      let userInfo = await db("user")
        .select(
          "*"
        )
        .where(condition);
      
      if (userInfo[0] == undefined)
        return {
          success: false,
          reason: "Utilisateur introuvable.",
          code: errorCode.NotFound,
        };
      
      for(let i = 0; i < userInfo.length; i++){
        delete userInfo[i].password
      }

      return {
        success: true,
        data: {
          user : userInfo
        },
      };
    } catch (err) {
      console.log("SELECT USER (backend/models/user.models.js) HAS ERROR : ");
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  /* algorithm de création du cookie de sécurité et du token*/
  static async createSecurityAuth(idUser) {
    try {
      if (idUser === undefined)
        return {
          success: false,
          reason: "Aucun id donnée.",
          code: errorCode.NotAcceptable,
        };

      let user = await User.selectUser({ ID: idUser });
      if (user.success == false) return user;

      let role = user.data.user[0].Type;

      let firstParToken =
        Buffer.from(`${idUser}`, "utf-8").toString("base64url") + ".";
      let secondParToken =
        Buffer.from(
          `${Date.now() - new Date(2022, 2, 27, 18).getTime()}`,
          "utf-8"
        ).toString("base64url") + ".";
      let endToken = Buffer.from(
        `${hashSync(
          scryptSync(role, "BonsourCetaitUnTest,RetireEnProdSTP.", 24, {
            N: 1024,
          }).toString("hex"),
          10
        )}`,
        "utf-8"
      ).toString("base64url");
      let Completetoken = firstParToken + secondParToken + endToken;
      let CompleteCookie = Buffer.from(
        `${hashSync(
          scryptSync(
            `${
              firstParToken +
              secondParToken +
              Buffer.from(`${Completetoken}`, "utf-8").toString("base64url")
            }`,
            "BonsourCetaitUnTest,RetireEnProdSTP.",
            24,
            { N: 1024 }
          ).toString("hex"),
          10
        )}`,
        "utf-8"
      ).toString("base64url");

      await db("user")
        .update(
          {
            token: Completetoken,
            CookieSecure: CompleteCookie,
          },
          ["ID"]
        )
        .where({ ID: idUser });

      return {
        success: true,
        data: { 
          token: Completetoken, 
          cookieSecure: CompleteCookie 
        },
      };
    } catch (err) {
      console.log(
        "CREATE SECURITY AUTH (backend/models/user.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static async comparePassword(email, password) {
    try {
      if (!email || !password)
        return {
          success: false,
          reason: "Email ou Mot de passe invalide.",
          code: errorCode.Unauthenticated,
        };

      let result = await db("user")
        .select("password", "token", "CookieSecure")
        .where({
          Email: email,
        });

      if (!result[0])
        return {
          success: false,
          reason: "Email ou Mot de passe invalide.",
          code: errorCode.Unauthenticated,
        };

      if ((await compare(password, result[0].password)) == true)
        return {
          success: true,
          data: {
            auth : {
              token: result[0].token,
              CookieSecure: result[0].CookieSecure,
            },
            commentaire : "Utilisateur bien connecté."
          },
        };

      return {
        success: false,
        reason: "Email ou Mot de passe invalide.",
        code: errorCode.Unauthenticated,
      };
    } catch (err) {
      console.log(
        "COMPARE PASSWORD (backend/models/user.models.js) HAS ERROR :"
      );
      console.log(err);

      return {
        success: false,
        code: errorCode.UnknownError,
      };
    }
  }

  static  modelNormilizer = async ( Userobj = { Pseudo, Email, password, Type, join_date },obligatoir = false) => {
    if (obligatoir && (!Userobj.Pseudo || !Userobj.password || !Userobj.Pseudo))
      return {
        success: false,
        reason: "Certaines informations obligatoires sont manquantes.",
        code: errorCode.NotAcceptable,
      };
    if(obligatoir){
      Userobj = {...Userobj, ...{Type :  "simpleUser", join_date: new Date()}}
    }

    if (
      Userobj.Pseudo &&
      (Userobj.Pseudo.length < 3 || Userobj.Pseudo.length > 50)
    )
      return {
        success: false,
        code: errorCode.NotAcceptable,
        reason: "Le pseudo ne doit pas faire plus de 50 caractère ou moins de 3.",
      };

    switch (Userobj.Type) {
      case "simpleUser":
        break;
      case "adminUser":
        break;
      default:
        if(obligatoir === true)
        return {
            success: false,
            code: errorCode.NotAcceptable,
            reason: "Le type d'utilisateur est invalide.",
          };
          
        break;
    }

    if (Userobj.Email) {
      if (!validator.validate(Userobj.Email.toLowerCase()))
        return {
          success: false,
          reason: "Votre email est invalide.",
          code: errorCode.NotAcceptable,
        };

      let userInfo = await User.selectUser({
        Email: Userobj.Email.toLowerCase(),
      });
      if (userInfo.success !== false)
        return {
          success: false,
          reason: "Email déjà utilisé.",
          code: errorCode.NotAcceptable,
        };
    }
    return suppNotUsed(Userobj);
  }
};
