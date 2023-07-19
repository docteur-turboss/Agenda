import OrganisationParamsForm from './components/Server/Organisation'
import ServerParamsForm from './components/Server/Organisation'

import './formParams.css'

let FormParamsServer = ({numberPage, handleApp}) =>{
    if(numberPage === 1){
        return <OrganisationParamsForm handleApp={handleApp}/>
    }else{
        return <ServerParamsForm handleApp={handleApp} />
    }
}

export default FormParamsServer