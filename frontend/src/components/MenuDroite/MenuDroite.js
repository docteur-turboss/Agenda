import './MenuDroite.css'
import {useState} from 'react'


let MenuDroiteDeJean = ({one, two, three, four}) =>{
    const [NavVisible, setNavVisible] = useState('')

    let handleChangeClick = () =>{
        if(NavVisible === 'nav-is-visible'){
            setNavVisible('')
        }else{
            setNavVisible('nav-is-visible')
        }
    }

    return (
        <nav className={"cd-stretchy-nav "+ NavVisible}>
            
            <a onClick={handleChangeClick} className="cd-nav-trigger" href="#0">
                <span aria-hidden="true"></span>
            </a>

            <ul>
                <li><a href="#0" className={"icon homebak " + one}><span>Profile</span></a></li>
                <li><a href="#0" className={"icon addbak " + two}><span>Add</span></a></li>
                <li><a href="#0" className={"icon modifbak " + three}><span>Modify</span></a></li>
                <li><a href="#0" className={"icon trashbak " + four}><span>Delete</span></a></li>
            </ul>

            <span aria-hidden="true" className="stretchy-nav-bg"></span>
        </nav>
    )

}

export default MenuDroiteDeJean