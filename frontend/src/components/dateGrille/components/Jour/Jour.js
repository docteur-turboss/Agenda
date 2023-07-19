import Hour from "./components.hours/Hours"

import './Jour.css'

let Jour = ({evenement, dateDay}) =>{    
    let heures = [{id:0,hour:"1 h",events:[]},{id:1,hour:"2 h",events:[]},{id:2,hour:"3 h",events:[]},{id:3,hour:"4 h",events:[]},{id:4,hour:"5 h",events:[]},{id:5,hour:"6 h",events:[]},{id:6,hour:"7 h",events:[]},{id:7,hour:"8 h",events:[]},{id:8,hour:"9 h",events:[]},{id:9,hour:"10 h",events:[]},{id:10,hour:"11 h",events:[]},{id:11,hour:"12 h",events:[]},{id:12,hour:"13 h",events:[]},{id:13,hour:"14 h",events:[]},{id:14,hour:"15 h",events:[]},{id:15,hour:"16 h",events:[]},{id:16,hour:"17 h",events:[]},{id:17,hour:"18 h",events:[]},{id:18,hour:"19 h",events:[]},{id:19,hour:"20 h",events:[]},{id:20,hour:"21 h",events:[]},{id:21,hour:"22 h",events:[]},{id:22,hour:"23 h",events:[]},{id:23,hour:"00 h",events:[]}]; /*Jugez pas j'aime pas react...*/

    if(evenement){
        evenement.forEach(event => {
            heures[new Date(event.datatime).getHours() - 1].events.push(event)
        });
    }

    let JourneyHeure = heures.map(heure => {
        if(heure.events[0] !== undefined){
            let EvenementDeLehure = heure.events.map(event =>{
                return (<div key={event.id*12} style={{backgroundColor : event.color_Cat | "initial" }} className={(event.etat === 1 ? "Finish ConteneurVent" : "ConteneurVent")}>
                    <p className="titreEvent">{event.Nom}</p>
                    <h6 className="descEvent">{event.desc}</h6>
                </div>)
            })
            return <Hour key={heure.id} hour={heure.hour} events={EvenementDeLehure}/>
        }
        return <Hour key={heure.id} hour={heure.hour} />
    })

    return (
        <div className="JourContain">
            <ul className="Jour">
                <li className="Hour fixed">
                    <h4>{dateDay}</h4>
                    <div className="event"></div>
                </li>
                <div className="pad-Hourclass">
                    <div className="hourClass">
                        {JourneyHeure}
                    </div>
                </div>
            </ul>
        </div>
    )
}

export default Jour