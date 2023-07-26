import { NavLink } from "react-router-dom";
import Jour from "./components/Jour/Jour";
import Mois from "./components/mois/mois";

let DateGrille = ({event, type, datePhocus}) =>{
    let titre = "", Grille;

    let dataDate = new Date(datePhocus)
    if(dataDate === "Invalid Date"){
        dataDate = new Date()
    }
    
    const MoisNom = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    const dayNames = ["Di","Lu","Ma","Me","Je","Ve","Sa"];

    if(type===1){
        titre = dayNames[dataDate.getDay()] + " " + dataDate.getDate() + " " + MoisNom[dataDate.getMonth()] + " " + dataDate.getFullYear()

        Grille = <Jour dateDay={dataDate.getDate() +"/"+ dataDate.getMonth()} evenement={event} />
    }else{
        titre = MoisNom[dataDate.getMonth()] + " " + dataDate.getFullYear()

        Grille = <Mois AnneeDate={dataDate.getFullYear()} DateMois={dataDate.getMonth()} evenement={event} />
    }

    return (
        <div className="agenda">
            <div className="header-nav">
                <h3>{titre}</h3>
                <div className="navigationDate">
                    <NavLink to={(type === 1 ? "/agenda/jour" : "/agenda/mois")} >{"<"}</NavLink>
                    <NavLink to={(type === 1 ? "/agenda/jour" : "/agenda/mois")} >{">"}</NavLink>
                </div>
            </div>

            {Grille}
        </div>
    )

}

export default DateGrille