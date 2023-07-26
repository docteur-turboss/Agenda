import MenuNavS from './components/headerMenuServer/headerMenu';
import MenuNavC from './components/headerMenuClient/headerMenu';
import './Menu.css';

let MenuClient = ({titre, active}) =>{
    return (<>
            <h2 className='Titre'>{!titre ? "" : titre}</h2>
            <MenuNavC one={!active.one ? "" : "active"} three={!active.three ? "" : "active"} two={!active.two ? "" : "active"}/>
        </>);
}

let MenuServer = ({titre, active}) =>{
    return(<>
        <h2 className='Titre'>{!titre ? "" : titre}</h2>
        <MenuNavS one={!active.one ? "" : "active"} two={!active.two ? "" : "active"} three={!active.three ? "" : "active"} />
    </>)
}

export {MenuClient, MenuServer}