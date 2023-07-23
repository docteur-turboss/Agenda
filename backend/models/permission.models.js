const db = require('../config/db')


class permission {

    /* créer une nouvelle perm */
    static createPerm = async(orgaInformationToUp = {User_ID, Organisation_ID, Permission}) =>{
        let info = await permission.modelNormilizer(orgaInformationToUp)

        if(info [0] == false){
            return info
        }

        await db('user_has_organisation').insert(info)
        
        return true
    }

    /*modification d'une perm */
    static async updatePerm (orgaInformationToUp = {Permission}, condition = {User_ID, Organisation_ID}) {

        let info = await permission.modelNormilizer(orgaInformationToUp)

        if(info [0] == false){
            return info
        }

        await db('user_has_organisation')
        .update(info)
        .where(condition)
        
        return true
    }

       

    /*détruction d'une perm*/
    static async destroyPerm (condition ={User_ID, Organisation_ID}){
        if(!condition.Organisation_ID){
            return [false, 406]
        }

        condition = suppNotUsed(condition)

        let objDest = {
            Organisation_ID : condition.Organisation_ID
        };
        (condition.User_ID === undefined) ? "": objDest.User_ID = condition.User_ID;

        
        let permInfo = await permission.selectPerm(condition)

        if(permInfo[0] == false){
            return permInfo
        }

        await db('user_has_organisation')
        .where(condition)
        .del()

        return true
    }

    /* sélection d'une ou plusieurs perms selon l'user ou l'orga */
    static async selectPerm (condition = {User_ID : undefined, Organisation_ID : undefined}){
        let permInfo;

        condition = suppNotUsed(condition)
        
        if(!condition.User_ID && !condition.Organisation_ID){
            return [false, 404]
        }
        
        permInfo = await db('user_has_organisation')
        .select("Permission")
        .where(condition)

        if(permInfo[0] == undefined)
        {
            return [false, 404]
        }
        
        return permInfo
    }

    /* normalise la data */
    static modelNormilizer = async (info = {User_ID, Organisation_ID, Permission}, obligatoire = false) =>{
        if(obligatoire == true || !info.Permission){
            if(!info.User_ID || !info.Organisation_ID || !info.Permission){
                return [false, 406, "Certaines informations fournit sont manquantes."]
            }
        }
        async function getDB(DBtable, params){
            let orgainfo = await db(DBtable)
            .select("ID")
            .where({ID : params})

            orgainfo = await orgainfo[0]

            if(orgainfo == undefined){
                return [false, 404, "L'organisme fournit n'est pas trouvable."]
            }
        }

        if(info.User_ID){
           let user = getDB('user', info.User_ID) 
           if(user[0] == false){
                return user
           }
        }
        
        if(info.Organisation_ID){
            let orgo = getDB('organisation', info.Organisation_ID)
            
            if(orgo[0] == false){
                return orgo
            }
        }
        

        info = suppNotUsed(info)

        return info
    }
}

function suppNotUsed(prop) {
    for (const property in prop) {
      if (!prop[property]) {
        delete prop[property]
      }
    }
    return prop
}

module.exports = permission;