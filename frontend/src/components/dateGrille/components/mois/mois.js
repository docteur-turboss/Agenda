import Day from "./components.day/Day";
import "./mois.css";

let Mois = ({ DateMois, AnneeDate, evenement }) => {
  let x = -1,
    y = 0;
  let calendrier = callendar(DateMois, AnneeDate);

  if (evenement) {
    evenement.forEach((event) => {
      let basPlace = Math.floor((new Date(event.datatime).getDate() - 1) / 7);
      let basNum = (new Date(event.datatime).getDate() - 1) % 7;

      calendrier[basPlace][basNum].events.push(event);

    });
  }

  let MoisJourney = calendrier.map((calendriers) => {
    x++;
    return (
      <>
        {calendriers.map((Cal) => {

          if (Cal.events[0] !== undefined) {
            let EvenementDuJour = Cal.events.map((event) => {
              return (
                <div key={event.id + "" +event.titre} className={"classified"}>
                  <p className="numero">{event.number}</p>
                </div>
              );
            });
            y++;
            return (
              <Day
                Sr={y % 7 !== 0 ? true : ""}
                Sb={(x + 1) % 6 !== 0 ? true : ""}
                key={DateMois+''+AnneeDate+""+(x+1)*y+1}
                day={Cal.jour}
                events={EvenementDuJour}
              />
            );
          }
          y++;
          return (
            <Day
              Sr={y % 7 !== 0 ? true : ""}
              Sb={(x + 1) % 6 !== 0 ? true : ""}
              key={DateMois+''+AnneeDate+""+(x+1)*y+1}
              day={Cal.jour}
            />
          );
        })}
      </>
    );
  });

  return (
    <div className="MoisContaint">
      <ul className="jours classJourUL">
        <li id="L" className="classJour Sbas Sright">
          Lu
        </li>
        <li id="Ma" className="classJour Sbas Sright">
          Ma
        </li>
        <li id="Me" className="classJour Sbas Sright">
          Me
        </li>
        <li id="J" className="classJour Sbas Sright">
          Je
        </li>
        <li id="V" className="classJour Sbas Sright">
          Ve
        </li>
        <li id="S" className="classJour Sbas Sright">
          Sa
        </li>
        <li id="D" className="classJour Sbas">
          Di
        </li>
      </ul>

      <div className="pad-jour">
        <div className="jours jourClass">
          <ul className="jours JourConteneurDe">{MoisJourney}</ul>
        </div>
      </div>
    </div>
  );
};

export default Mois;

function callendar(DateMois, AnneeDate) {
  let temps = new Date(AnneeDate, DateMois, 1);
  let Start = temps.getDay();
  if (Start > 0) Start--;
  else Start = 6;
  let Stop = 31;
  

  if (DateMois === 3 || DateMois === 5 || DateMois === 8 || DateMois === 10)
    --Stop;
  if (DateMois === 1) {
    Stop = Stop - 3;
    if (AnneeDate % 4 === 0) Stop++;
    if (AnneeDate % 100 === 0) Stop--;
    if (AnneeDate % 400 === 0) Stop++;
  }
  let Mois = [];
  let nombre_jours = 1;
  let id = 0;

  for (let i = 0; i <= 5; i++) {
    Mois.push([]);
    for (let j = 0; j <= 5; j++) {
      if ((i === 0 && j < Start) || nombre_jours > Stop) {
        Mois[i][j] = { id: id, jour: "", events: [] };
        id++;
      } else {
        Mois[i][j] = { id: id, jour: nombre_jours, events: [] };
        id++;
        nombre_jours++;
      }
    }
    if (nombre_jours > Stop) {
      Mois[i].push({ id: id, jour: "", events: [] });
      id++;
    } else {
      Mois[i].push({ id: id, jour: nombre_jours, events: [] });
      id++;
      nombre_jours++;
    }
  }
  return Mois;
}
