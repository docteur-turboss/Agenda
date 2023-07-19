import { NavLink } from 'react-router-dom';
import './ArticleAccueil.css'

let ArticleAccueil = ({titre, desc, color, footer, logoImg, reversed}) =>{

    let foo, ig, contenu;

    if(footer){
        foo = <NavLink to={'/sign/up'} className="btn">{footer}</NavLink>
    }else{
        foo = ""
    }
    if(logoImg){
        ig = <img src={logoImg} className="imgArticle" alt="illustration d'article"/>
    }else{
        ig = ""
    }

    let contains = <div className="content">
        <h3 className="titre">{titre}</h3>
        <p className="desc">{`${desc}`}</p>
        {foo}

        
    </div>

    if(color){
        contenu = 
        <div className={`article${reversed === true ? " reverse" : ''}`} style={{backgroundColor: '#' + color}}>
            {contains}
            {ig}
        </div>
    }else{
        contenu = 
        <div className={`article${reversed === true ? " reverse" : ''}`}>
            {contains}
            {ig}
        </div>
    }

    return contenu
}

export default ArticleAccueil;