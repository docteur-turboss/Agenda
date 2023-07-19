import {FormSignIn, FormSignUp, Forgot} from "../../components/forms/FormLog";

let Signin = ({handleApp}) =>{
    return <FormSignIn handleApp={handleApp} />
}

let Signup = ({handleApp}) =>{
    return <FormSignUp handleApp={handleApp}/>
}

let PassForgot = ({handleApp}) =>{
    return <Forgot handleApp={handleApp}/>
}

export  {Signin, Signup, PassForgot};
