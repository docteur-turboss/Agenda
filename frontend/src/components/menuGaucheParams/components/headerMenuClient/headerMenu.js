import { NavLink } from 'react-router-dom'
import './headerMenu.css'
import { useState } from 'react'
let MenuNavC = ({one, two, three}) =>{

    let [NavVisible, setNavVisible] = useState('')

    let handleChangeClick = () =>{
        if(NavVisible === 'nav-is-visible'){
            setNavVisible('')
        }else{
            setNavVisible('nav-is-visible')
        }
    }


    return (
        <nav className={"cd-stretchy-nav " + NavVisible}>
            <p onClick={handleChangeClick} className="cd-nav-trigger">
                <span aria-hidden="true"></span>
            </p>

            <ul>
                <li><NavLink to={'/@me'} className={"icon homebak " + one}><span>Home</span></NavLink></li>
                <li><NavLink to={'/user/params/profil'} className={"icon profilbak " + two}><span>Profil</span></NavLink></li>
                <li><NavLink to={"/user/params/compte"} className={"icon comptebak " + three}><span>Compte</span></NavLink></li>
            </ul>

            <span aria-hidden="true" className="stretchy-nav-bg"></span>
        </nav>
    )
}

export default MenuNavC