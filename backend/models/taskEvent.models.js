const db = require('../config/db')

class task_organisation {

    /* créer une nouvelle task */
    static createTask = async(orgaInformationToUp = {name : "", etat, category_event_ID, Organisation_ID, desc, Datetime, Where}) =>{
        let taskObj = await task_organisation.modelNormilizer(orgaInformationToUp, true)
        
        if(taskObj[0] == false){
            return taskObj
        }

        let category_event = await db('category_event')
        .select('ID')
        .where({ID : taskObj.category_event_ID})

        if(category_event[0] == undefined){
            console.log(6)
            return [false, 401]
        }

        let Organisation = await db('Organisation')
        .select('ID')
        .where({ID : taskObj.Organisation_ID})

        if(Organisation[0] == undefined){
            console.log(7)
            return [false, 401]
        }


        let IDTASK = await db("task_event").insert(taskObj, ['id'])

        return {
            success : true,
            id : IDTASK[0]
        }
    }

    /*modification de la task de l'orga*/
    static async updateTask (orgaInformationToUp = {name : "", etat : 0, category_event_ID, desc, Datetime, Where}, condition = {ID}) {

        let taskObj = await task_organisation.modelNormilizer(orgaInformationToUp)

        if(taskObj[0] == false){
            return taskObj
        }

        let category_event = await db('category_event')
        .select('ID')
        .where({ID : taskObj.category_event_ID})

        if(category_event[0] == undefined){
            console.log(8)
            return [false, 401]
        }

        await db('task_event')
        .update(taskObj)
        .where(condition)
        
        return true
    }

    /*détruction de la task of orga*/
    static async destroyTask (condition ={ID, category_event_ID, Agenda_ID}){
        if(!condition.ID && !condition.category_event_ID && !condition.Agenda_ID){
            return [false, 406]
        }
        condition = suppNotUsed(condition)
        let objCo = {};

        (condition.ID == undefined) ? '' : objCo.ID = condition.ID;
        (condition.category_event_ID == undefined) ? '' : objCo.category_event_ID = condition.category_event_ID;
        (condition.Agenda_ID == undefined) ? '' : objCo.Organisation_ID = condition.Agenda_ID;

        let taskInfo = await task_organisation.selectTask(objCo)

        if(taskInfo[0] == false){
            return taskInfo
        }

        await db('task_event')
        .where(objCo)
        .del()

        return true
    }

    /* sélection d'un ou plusieurs task (task d'agenda| task de projet)*/
    static async selectTask (condition = {ID : undefined, Organisation_ID : undefined, category_event_ID : undefined}){
        let orgainfo;
        if(condition.ID || condition.Organisation_ID || condition.category_event_ID){
            condition = suppNotUsed(condition)
            orgainfo = await db('task_event')
            .select("*")
            .where(condition)

            orgainfo = orgainfo[0]
        }else{
            orgainfo = await db('task_event')
            .select("*")
        }

        if(orgainfo == undefined){
            return [false, 404]
        }
        
        return orgainfo
    }

    /* normalise la data */
    static modelNormilizer = async (info = {name : "", etat : 0, category_event_ID, Organisation_ID, desc, Datetime, Where}, obligatoire = false) =>{
        if(
            (obligatoire == true && 
                (info.name == "" || !info.category_event_ID || !info.Organisation_ID) || (info.etat < 0 && info.etat >= 2)
            ) || (
                (info.name && (info.name.length < 4 || info.name.length > 50)) || 
                (info.desc && info.desc.length > 150) || 
                (info.Where && info.Where.length > 250) ||
                (info.Datetime && (isNaN(parseInt(info.Datetime))))
            )
        ){
            return [false, 406]
        }
        if(info.Datetime){
            info.Datetime = new Date(parseInt(info.Datetime))
        }

        info = suppNotUsed(info)

        return info
    }
}

function suppNotUsed(prop) {
    for (const property in prop) {
      if (!prop[property] && prop[property] !== 0) {
        delete prop[property]
      }
    }
    return prop
}

module.exports = task_organisation;