import { useState } from 'react'

let CategoryParamsForm = ({handleApp}) =>{

    let [categoryParams, setCategoryParams] = useState({
        color : "",
        Name : ""
    })

    let handleChange = (evt) =>{
        const {name, value} = evt.target
        setCategoryParams({...categoryParams, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(categoryParams)
        
        setCategoryParams({
            color : "",
            Name : ""
        })
    }
 
    return (
        <form onSubmit={(evt) => handleSubmit(evt)} className="formid-assemble">
            <label className="formid-part" htmlFor="color">Couleur de la catégorie</label>
            <br/>

            <input value={categoryParams.color} onChange={(evt) => handleChange(evt)} className="formid-part formid-complete" type="color" name="color" id="color"/>
            <br/>
            <label className="formid-part" htmlFor="Name">Nom de la catégorie</label>
            <br/>

            <input value={categoryParams.name} onChange={(evt) => handleChange(evt)} className="formid-part formid-complete" placeholder="catégorie de François" type="text" name="Name" id="Name"/>
            <br/>
            <input type="submit" className="btn formid-part" value="Envoyer"/>
        </form>
    ) 
}

export default CategoryParamsForm