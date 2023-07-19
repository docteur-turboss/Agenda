import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import {ServerParams, UserParams} from './pages/params/Params';
import { Signin, Signup, PassForgot} from './pages/sign/Sign';
import Agenda from './pages/agenda/agenda';
import Home from './pages/Home/Home';

import authContexts from './contexts/authContexts';

import './App.css';

let App = () => {
  let [AuthificationInformation, setAuthificationInformation] = useState()

  let [PseudoInfo, setPseudoInfo] = useState({
    pseudo : ""
  })
  let [CompteInfo, setCompteInfo] = useState({
    password : "",
    pseudo : ""
  })

  let [OrganisationInfo, setOrganisationInfo] = useState({
    Nom : ""
  })
  let [categoryParams, setCategoryParams] = useState({
    Name : "",
    color : ""
  })

  let InfoCoHandleChange = (data) =>{
    if(data.pseudo){
      setPseudoInfo({
        pseudo: data.pseudo
      })
      delete data.pseudo
    }

    if(data.email && data.password){
      setCompteInfo({
        password : data.password,
        email : data.email
      })
      delete data.Email
      delete data.password
    }
  }

  let OrganisationHandleChange = (data) =>{
    if(data.Nom){
      setOrganisationInfo({
        pseudo: data.Nom
      })
      delete data.Nom
    }

    if(data.Name && data.color){
      setCategoryParams({
        Name : data.Name,
        color : data.color
      })
      delete data.Name
      delete data.color
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={ <Home/> } />
        
        <Route path="/sign/in" element={<Signin handleApp={InfoCoHandleChange}/>} /> 
        <Route path='/sign/up' element={<Signup handleApp={InfoCoHandleChange}/>} />

        <Route path='/forgot/password' element={<PassForgot handleApp={InfoCoHandleChange}/>} />

        <Route  path='/server/params/general' element={<ServerParams handleApp={OrganisationHandleChange} response={{success : undefined , messageSuccess : undefined}} Page={{NumeroP : 0, titre : undefined}} /> } />
        <Route path='/server/params/category' element={<ServerParams handleApp={OrganisationHandleChange} response={{success : undefined , messageSuccess : undefined}} Page={{NumeroP : 1, titre : undefined}} /> } />
        
        
        <Route path='/user/params/profil' element={<UserParams handleApp={InfoCoHandleChange} response={{success : undefined , messageSuccess : undefined}} Page={{NumeroP : 0, titre : PseudoInfo.pseudo}} /> } />
        <Route path='/user/params/compte' element={<UserParams handleApp={InfoCoHandleChange} response={{success : undefined , messageSuccess : undefined}} Page={{NumeroP : 1, titre : PseudoInfo.pseudo}} /> } />

        <Route path='/agenda/jour' element={ <Agenda type={1} /> } />
        <Route path='/agenda/mois' element={ <Agenda type={0} /> } />

        <Route path='/@me' element={ <Agenda type={0} />} />
      </Routes>
    </>
  );
}

export default App;