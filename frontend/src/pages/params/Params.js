import FormParamsUser from "../../components/formParams/formParams.User";
import FormParamsServer from "../../components/formParams/formParams.Server";

import {MenuClient, MenuServer} from "../../components/menuGaucheParams/Menu";

import "./Params.css";

let UserParams = ({handleApp, Page, response}) =>{
  return (
    <div className="Page">
      <MenuClient titre={Page.titre} active={{two : (Page.NumeroP + 1 === 1 ? true : false), three : (Page.NumeroP + 1 === 2 ? true : false) }} />
      {
        (!response)?
          ""
        :
        <div className={(response.success === true) ? 'mess success' : response.success === false ? 'mess error' : 'hidden'}>
            {response.messageSuccess}
        </div>
      }
      <FormParamsUser numberPage={Page.NumeroP} handleApp={handleApp} />
    </div>
  )
}

let ServerParams = ({handleApp, Page, response}) =>{
  return (
    <div className="Page">
      <MenuServer titre={Page.titre} active={{two : (Page.NumeroP === 1 ? true : false), three : (Page.NumeroP === 0 ? true : false) }} />
      {
        (!response)?
          ""
        :
        <div className={(response.success === true) ? 'mess success' : response.success === false ? 'mess error' : 'hidden'}>
            {response.messageSuccess}
        </div>
      }

        <FormParamsServer numberPage={Page.NumeroP} handleApp={handleApp} />
    </div>
  )
}

export {ServerParams, UserParams};
