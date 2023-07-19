const permission = require('./permission.models')
const db = require('../config/db')


class Organisation {

    /* créer un nouvel agenda */
    static createAgenda = async(orgaInformationToUp = {Nom, Type, idOwner}) =>{
        let info = await Organisation.modelNormilizer(orgaInformationToUp, true)

        if(info[0] == false){
            return info
        }

        let IDOrga = await db("organisation").insert({
            Nom : orgaInformationToUp.Nom,
            Type : orgaInformationToUp.Type
        }, ["ID"])

        let firstPerm = await permission.createPerm({Organisation_ID : IDOrga[0], Permission : "manager", User_ID: orgaInformationToUp.idOwner})

        if(firstPerm[0] == false){
            return firstPerm
        }

        return true
    }

    /*modification de l'organisation*/
    static async updateAgenda (orgaInformationToUp = {Nom}, condition = {ID}) {

        let info = await Organisation.modelNormilizer(orgaInformationToUp)

        if(info[0] == false){
            return info
        }
        await db('organisation')
        .update(info)
        .where(condition)
        
        return true
    }

    /*détruction de l'organisation*/
    static async destroyAgenda (condition ={ID}){
        if(!condition.ID){
            return [false, 406]
        }
        
        let agendainfo = await Organisation.selectAgenda(condition);

        if(agendainfo[0] == false){
            return agendainfo
        }

        await db('organisation')
        .where(condition)
        .del()

        return true
    }

    /* sélection d'un ou plusieurs organisation (agenda|projet)*/
    static async selectAgenda (condition = {ID : undefined}){
        let orgainfo;
        if(condition.ID !== undefined){
            orgainfo = await db('organisation')
            .select("ID", "Nom", "type")
            .where(condition)

            orgainfo = await orgainfo[0]
        }else{
            orgainfo = await db('organisation')
            .select("ID", "Nom", "type")
        }

        if(orgainfo == undefined){
            return [false, 404]
        }
        
        return orgainfo
    }

    /* normalise la data */
    static modelNormilizer = async (info = {Nom, Type : 0}, obligatoire = false) =>{
        if((obligatoire == true && (!info.Nom)) || (info.Nom && (info.Nom.length < 3 || info.Nom.length > 99)) || (info.Type && (info.Type <  0 || info.Type >= 2))){
            return [false, 406]
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

module.exports = Organisation;