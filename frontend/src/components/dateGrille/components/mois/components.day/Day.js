let Day = ({ day, Sb, Sr, events }) => {
  let classNumeroSouligne = "jour";

  if (Sb) classNumeroSouligne += " Sbas";
  if (Sr) classNumeroSouligne += " Sright";

  if (!events) {
    return (
      <li className={classNumeroSouligne}>
        <div className="numberJour">{day}</div>
        <div className="events"></div>
      </li>
    );
  }

  return (
    <li className={classNumeroSouligne}>
      <div className="numberJour">{day}</div>
      <div className="events">{events}</div>
    </li>
  );
};

export default Day;

/**
 * 
<li className="jour Sbas Sright">
    <div className="numberJour">1</div>
    <div className="events">
        <div className="event">
        <p className="numero">01</p>
        <p className="titre">Rendez-vous</p>
        </div>
    </div>
</li>

    <li className="jour">
        <div className="numberJour">
            &amp;#160;
        </div>
        <div className="events">
        </div>
    </li>
* 
 */
