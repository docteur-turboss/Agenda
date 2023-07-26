import { NavLink } from 'react-router-dom';

import Logo from '../../img/logo.png';
import "./header.css"

let Header = () =>{

    return (
        <div className="welcom">
            <div className="header">
                <img src={Logo} className="app-logo" alt="logo"/>
                <h1>Avent</h1>
                <NavLink to={"/sign/in"} className="btn">connexion</NavLink>
            </div>
            <div className="home">
                <h1>C'était mieux Avent...</h1>
                <div>Plannifiez vos évènements ! Plannifiez vos projets ! Seul le temps est une limite ici</div>
                <NavLink to={"/sign/up"} className="btn">Inscrivez-vous</NavLink>
            </div>
        </div>
    )
}

export default Header;