const permission = require('./permission.models')
const db = require('../config/db')
const suppNotUsed = require('../utils/deleteParamsNotUsed')


class Organisation {

    /* créer un nouvel agenda */
    static createAgenda = async(orgaInformationToUp = {Nom, Type, idOwner}) =>{
        let info = await Organisation.modelNormilizer(orgaInformationToUp, true)

        if(info[0] == false){
            return info
        }

        let IDOrga = await db("organisation").insert({
            Nom : info.Nom,
            type : info.Type
        }, ["ID"])

        let firstPerm = await permission.createPerm({Organisation_ID : IDOrga[0], Permission : "manager", User_ID: orgaInformationToUp.idOwner})

        if(firstPerm[0] == false){
            return firstPerm
        }

        return {
            success : true,
            id : IDOrga[0]
        }
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
        if(obligatoire == true && !info.Nom){
            return [false, 406, "Certaines information fournit sont manquantes."]
        }

        if(info.Nom && ( 100 < info.Nom.length && info.Nom.length < 3)){
            return [false, 406, "Le nom est suppérieur à 100 ou inférieur à 3."]
        }

        if(info.Type && (info.Type < 0 || info.Type > 1)){
            return [false, 406, "Merci d'éviter ce genre de manipulation. C'est soit agenda, soit projet, pas xyz."]
        }

        info = suppNotUsed(info)

        return info
    }
}

module.exports = Organisation;