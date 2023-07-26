import { useState } from 'react';

let UserParamsFormCompte = ({handleApp}) =>{
    let [CompteInfo, setCompteInfo] = useState({
        password : '',
        email : ''
    })

    let handleInfoCompteChange = (evt) =>{
        const {name, value} = evt.target
        setCompteInfo({...CompteInfo, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(CompteInfo)

        setCompteInfo({
            password : '',
            email : ''
        })
    }

    return (
        <form onSubmit={(evt) => handleSubmit(evt)} className="formid-assemble">
           <label className="formid-part" htmlFor="email">Email</label>
            <br/>

            <input value={CompteInfo.email} onChange={evt =>handleInfoCompteChange(evt)} className="formid-part formid-complete" placeholder="Email" type="email" name="email" id="email"/>
            <br/>

            <label className="formid-part" htmlFor="password">Mot de passe</label>
            <br/>

            <input value={CompteInfo.password} onChange={evt =>handleInfoCompteChange(evt)} className="formid-part formid-complete" placeholder="Mot de passe" type="password" name="password" id="password"/>
            <br/>

            <input type="submit" className="btn formid-part" value="Envoyer"/>
        </form>
    )
}

export default UserParamsFormCompte