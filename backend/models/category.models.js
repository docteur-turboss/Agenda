const db = require('../config/db')


class category {
    /* créer une nouvelle category */
    static createCategory = async(orgaInformationToUp = {Name, color, Organisation_ID}) =>{
        let info = await category.modelNormilizer(orgaInformationToUp, orgaInformationToUp.Organisation_ID, true)

        if(info[0] == false){
            return info
        }

        await db("category_event").insert(info)

        return true
    }

    /*modification de l'organisation*/
    static async updateCategory (orgaInformationToUp = {Name, color}, condition = {Organisation_ID}) {

        let info = await category.modelNormilizer(orgaInformationToUp, condition.Organisation_ID)
        
        if(info[0] == false){
            return info
        }

        await db('category_event')
        .update(info)
        .where(condition)
        
        return true
    }

    /*détruction de l'organisation*/
    static async destroyCategory (condition ={ID_Cat, agenda_ID}){
        if(!condition.ID_Cat && !condition.agenda_ID){
            return [false, 406]
        }
        let objCondi = {};

        (condition.ID_Cat == undefined) ? "" : objCondi.ID = condition.ID_Cat;
        (condition.agenda_ID == undefined) ?"" : objCondi.agenda_ID = condition.agenda_ID;
        
        let Selected = await category.selectCategory(objCondi)

        if(Selected[0] == false){
            return Selected
        }

        await db('category_event')
        .where(objCondi)
        .del()

        return true
    }

    /*sélection d'un ou plusieurs catégory*/
    static async selectCategory (condition = {Organisation_ID : undefined, ID : undefined}){
        let orgainfo;
        if(condition.ID){
            orgainfo = await db('category_event')
            .select("*")
            .where({ID : condition.ID})

            orgainfo = await orgainfo[0]
        }else if(condition.Organisation_ID){
            orgainfo = await db('category_event')
            .select("*")
            .where({Organisation_ID : condition.Organisation_ID})
        }

        if(orgainfo == undefined){
            return [false, 404]
        }
        
        return orgainfo
    }

    /* normalise la data */
    static modelNormilizer = async (info = {Name, color}, Organisation_ID, obligatoire = false) =>{
        if(((obligatoire == true) && (!info.Name || !info.color || !Organisation_ID)) || ((info.Name && ( info.Name.length < 2 || info.Name.length > 100)) || (info.color && info.color.length > 8))){
            return [false, 406]
        }

        let orgainfo = await db('organisation')
        .select("ID")
        .where({ID : Organisation_ID})

        orgainfo = await orgainfo[0]

        if(orgainfo == undefined){
            return [false, 405]
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

module.exports = category;