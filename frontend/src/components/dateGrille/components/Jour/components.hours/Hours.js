let Hour = ({hour, events}) =>{
    if(!events){
        return (
            <li className="Hour">
                <h4>{hour}</h4>
                <div className="event"></div>
            </li>
        )
    }

    return (
        <li className="Hour">
            <h4>{hour}</h4>
            <div className="event">{events}</div>
        </li>
    )
    
}

export default Hour