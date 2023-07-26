import { useState } from 'react'

let OrganisationParamsForm = ({handleApp}) =>{

    let [OrganisationParams, setCategoryParams] = useState({
        Nom : ""
    })

    let handleChange = (evt) =>{
        const {name, value} = evt.target
        setCategoryParams({...OrganisationParams, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(OrganisationParams)

        setCategoryParams({
            Nom : ""
        })
    }
 
    return (
        <form onSubmit={(evt) => handleSubmit(evt)} className="formid-assemble">
            <label className="formid-part" htmlFor="Nom">Nom de l'organisation</label>
            <br/>

            <input value={OrganisationParams.name} onChange={evt => handleChange(evt)} className="formid-part formid-complete" placeholder="Organisation de Pierre" type="text" name="Nom" id="Nom"/>
            <br/>
            <input type="submit" className="btn formid-part" value="Envoyer"/>
        </form>
    )
}

export default OrganisationParamsForm