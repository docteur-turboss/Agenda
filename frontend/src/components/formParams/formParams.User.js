import UserParamsFormCompte from './components/User/Compte'
import UserParamsFormProfile from'./components/User/Profile'

import './formParams.css'

let FormParamsUser = ({numberPage, handleApp}) =>{
    if(numberPage === 1){
        return <UserParamsFormCompte handleApp={handleApp}/>
    }else{
        return <UserParamsFormProfile handleApp={handleApp} />
    }
}

export default FormParamsUser