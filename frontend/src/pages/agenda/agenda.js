import MenuDroiteDeJean from "../../components/MenuDroite/MenuDroite";
import DateGrille from "../../components/dateGrille/DateGrille";

let Agenda = ({type, events, one, two, three, four, datePhocus}) =>{

    return (
        <>
            <MenuDroiteDeJean four={four} three={three} two={two} one={one}/>
            <DateGrille event={events} datePhocus={datePhocus} type={type}/>
        </>
    )

}

export default Agenda