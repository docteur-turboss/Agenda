import { NavLink } from 'react-router-dom'
import './headerMenu.css'

import {useState} from 'react'

let MenuNavS = ({one, two, three}) =>{

    let [NavVisible, setNavVisible] = useState('')

    let handleChangeClick = () =>{
        if(NavVisible === 'nav-is-visible'){
            setNavVisible('')
        }else{
            setNavVisible('nav-is-visible')
        }
    }

    return (
        <nav className={"cd-stretchy-nav "+NavVisible}>
            <a onClick={handleChangeClick} className="cd-nav-trigger" href="#0">
                <span aria-hidden="true"></span>
            </a>

            <ul>
                <li><NavLink to={'/@me'} className={"icon homebak " + one}><span>Home</span></NavLink></li>
                <li><NavLink to={'/server/params/category'} className={"icon catbak " + two}><span>categorie</span></NavLink></li>
                <li><NavLink to={'/server/params/general'} className={"icon ibak " + three}><span>info</span></NavLink></li>
            </ul>

            <span aria-hidden="true" className="stretchy-nav-bg"></span>
        </nav>
    )
}

export default MenuNavS