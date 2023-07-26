import { useState } from "react"

let UserParamsFormProfile = ({handleApp}) =>{
    let [profile, setProfile] = useState({
        pseudo : ""
    })

    let handleChangeProfile = (evt) =>{
        const {name, value} = evt.target
        setProfile({...profile, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(profile)

        setProfile({
            pseudo : ""
        })
    }

    return (
        <form onSubmit={(evt) => handleSubmit(evt)} className="formid-assemble">
            <label className="formid-part" htmlFor="pseudo">Pseudo</label>
            <br/>
            <input onChange={evt => handleChangeProfile(evt)} value={profile.pseudo} className="formid-part formid-complete" placeholder="Pseudo" type="text" name="pseudo" id="pseudo" required/>
            <br/>

            <input type="submit" className="btn formid-part" value="Envoyer"/>
        </form>
    )
}

export default UserParamsFormProfile