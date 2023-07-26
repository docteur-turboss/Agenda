import Header from '../../components/header/header';
import ArticleAccueil from '../../components/presentationPage/ArticleAccueil';
import Logo from '../../img/pubAccueil1.jpg';
import Logo2 from '../../img/pubAccueil2.jpg'

let Home = () => {
    return (
        <>
            <Header />
            <ArticleAccueil reversed={false} color={"9FDAEA"} desc={"Facile à utiliser et à s'organiser ! Tout devient facile une fois que toutes les taches sont automatisé !"} logoImg={Logo} titre={'Ergonomie de prise en main'}/>
            <ArticleAccueil reversed={true} color={"B9F1FF"} desc={"Avec notre interface compréhensible, vous pouvez aisément modifer votre agenda comme vous le voulez."} titre={"Facile à modifier"} footer={"Inscrivez vous !"} logoImg={Logo2} />
        </>
    )
}
export default Home;