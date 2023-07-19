import './FormLog.css';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';

let FormSignIn = ({handleApp}) =>{

    let [connexionParams, setConnexionParams] = useState({
        email : "",
        password : "",
        pseudo : ""
    })

    let handleChange = (evt) =>{
        const {name, value} = evt.target
        setConnexionParams({...connexionParams, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(connexionParams)

        setConnexionParams({
            email : "",
            password : "",
            pseudo : ""
        })
    }

    return (
        <div className="form">

            <div className="form-sect-1 form-sect">
                <h1>Connexion</h1>
                <form onSubmit={(evt) => handleSubmit(evt)}>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="pseudo">Pseudo</label>
                        <br/>

                        <input value={connexionParams.pseudo} onChange={evt => handleChange(evt)} className="form-part form-complete" placeholder="Pseudo" type="text" name="pseudo" id="pseudo" required/>
                        <br/>
                    </div>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="email">Email</label>
                        <br/>

                        <input value={connexionParams.email} onChange={evt => handleChange(evt)} className="form-part form-complete" placeholder="Email" type="email" name="email" id="email" required/>
                        <br/>
                    </div>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="password">Mot de passe</label>
                        <br/>

                        <input value={connexionParams.password} onChange={evt => handleChange(evt)} className="form-part form-complete" placeholder="Mot de passe" type="password" name="password" id="password" required/>
                        <br/>
                    </div>
                    <br/>

                    <div className="separator">
                        <input type="submit" className="btn formi-part" value={"Inscription"}/>
                        <NavLink to={'/forgot/password'} className="link">
                            Mot de passe oublié
                        </NavLink>
                    </div>
                </form>
            </div>

            <div className="form-sect-2 form-sect">
                <h3>
                    Bienvenue à la page de connexion
                </h3>
                <p>
                    Vous n'avez pas encore de compte ?
                </p>
                <NavLink to={'/sign/up'} className="btn">
                    Inscription
                </NavLink>
            </div>
        </div>
    )
}

let FormSignUp = ({handleApp}) =>{

    let [connexionParams, setConnexionParams] = useState({
        email : "",
        password : ""
    })

    let handleChange = (evt) =>{
        const {name, value} = evt.target
        setConnexionParams({...connexionParams, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(connexionParams)

        setConnexionParams({
            email : "",
            password : "",
        })
    }

    return (
        <div className="form">

            <div className="form-sect-1 form-sect">
                <h1>Inscription</h1>
                <form onSubmit={(evt) => handleSubmit(evt)}>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="email">Email</label>
                        <br/>

                        <input value={connexionParams.email} onChange={evt => handleChange(evt)} className="form-part form-complete" placeholder="Email" type="email" name="email" id="email" required/>
                        <br/>
                    </div>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="password">Mot de passe</label>
                        <br/>

                        <input value={connexionParams.password} onChange={evt => handleChange(evt)} className="form-part form-complete" placeholder="Mot de passe" type="password" name="password" id="password" required/>
                        <br/>
                    </div>
                    <br/>
                    <div className="separator">
                        <input type="submit" className="btn formi-part" value={'Connexion'}/>
                    </div>
                </form>
            </div>

            <div className="form-sect-2 form-sect">
                <h3>
                    Bienvenue à la page d'Inscription
                </h3>
                <p>
                    Vous avez déjà un compte ?
                </p>
                <NavLink to={"/sign/in"} className="btn">
                    Connexion
                </NavLink>
            </div>  
        </div>
    )
}


let Forgot = ({handleApp}) => {
    let [connexionParams, setConnexionParams] = useState({
        email : "",
    })

    let handleChange = (evt) =>{
        const {name, value} = evt.target
        setConnexionParams({...connexionParams, [name] : value})
    }

    let handleSubmit = (evt) =>{
        evt.preventDefault();
        handleApp(connexionParams)

        setConnexionParams({
            email : "",
        })
    }

    return (
        <div className="form">
            <div className="form-sect-1 form-sect">
                <h1>Mot de passe oublié</h1>

                <form onSubmit={(evt) => handleSubmit(evt)}>
                    <div className="formi-assemble">
                        <label className="form-part" htmlFor="email">Email</label>
                        <br/>

                        <input onChange={(evt) => handleChange(evt)} className="form-part form-complete" placeholder="Email" type="email" name="email" id="email" required/>
                        <br/>
                    </div>
                        
                    <div className="separator">
                        <input type="submit" className="btn formi-part" value={"Reset password"}/>
                    </div>
                </form>
            </div>

            <div className="form-sect-2 form-sect">
                <h3>
                    Bienvenue à la page des mot de passes perdu
                </h3>
                <p>
                    Vous n'avez pas encore de compte ?
                </p>
                <NavLink to={'/sign/up'} className="btn">
                    Inscription
                </NavLink>
            </div>

        </div>
    )
}


export {FormSignUp, FormSignIn, Forgot}