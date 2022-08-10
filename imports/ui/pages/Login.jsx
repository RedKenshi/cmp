import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import Button from '../elements/Button';

const AppBody = props => {

    const [action, setAction] = useState("login");
    const [formValues, setFormValues] = useState({
        mail:'',
        pass:'',
        newmail:'',
        firstname:'',
        lastname:'',
        newpass:'',
        newpassconfirm:''
    });
    const handleChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }

    const login = () => {
        Meteor.loginWithPassword(formValues.mail, formValues.pass,
            error=>{
                if(!error){
                    props.loadUser();
                }else{
                    props.toast({message:error.reason,type:"error"})
                }
            }
        );
    }
    const register = () => {
        Accounts.createUser({
            email: formValues.newmail,
            password: formValues.newpass,
            profile: {
                firstname: formValues.firstname,
                lastname: formValues.lastname
            },
            settings:{
              isAdmin:false,
              isOwner:false              
            }
        },(err)=>{
            if(err){
                console.log(err)
                return
            }else{
                Meteor.loginWithPassword(formValues.newmail, formValues.newpass,
                    error=>{
                        if(!error){
                            props.loadUser();
                        }else{
                            props.toast({message:error.reason,type:"error"})
                        }
                    }
                );
                useNavigate("/home")
            }
        })
    }

    if(action == "login"){
        return (
            <div className="landing-container">
                <div className="form-container">
                    <div className="form">
                        <h1>Welcome please login or register</h1>
                        <input className="input" name="mail" placeholder="mail" onChange={handleChange}/>
                        <input className="input" name="pass" placeholder="pass" onChange={handleChange} type="password"/>
                        <Button onClick={login} light icon="fas fa-arrow-right" color="success" text="Login"/>
                        <Button onClick={()=>setAction({action:"register"})} light color="info" text="Register"/>
                    </div>
                </div>
                <img src="/img/stone.svg"/>
            </div>
        );
    }else{
        let error = false;
        let errorColor = "";
        let errorTitle = "";
        let errorContent = "";
        if(formValues.newpass != formValues.newpassconfirm){
            error = true;
            errorColor = "is-danger";
            errorTitle = "Information érronées";
            errorContent = "Les mots de passe sont differents";
        }
        if(formValues.firstname == "" || formValues.newlastname == "" || formValues.newpass == "" || formValues.newpassconfirm == "" || formValues.newmail == ""){
            error = true;
            errorColor = "is-warning";
            errorTitle = "Information Incomplètes";
            errorContent = "Tous les champs doivent être renseignés";
        }
        return (
            <div className="landing-container">
                <div className="form-container">
                    <div className="form">
                        <h1>Welcome please login or register</h1>
                        <input className="input" name="newmail" placeholder="mail" onChange={handleChange}/>
                        <input className="input" name="firstname" placeholder="firstname" onChange={handleChange}/>
                        <input className="input" name="lastname" placeholder="lastname" onChange={handleChange}/>
                        <input className="input" name="newpass" placeholder="pass" onChange={handleChange} type="password"/>
                        <input className="input" name="newpassconfirm" placeholder="confirm pass" onChange={handleChange} type="password"/>
                        <Button onClick={(error ? ()=>{} : register)} disabled={error} light icon="fas fa-arrow-right" color="success" text="Register"/>
                        <Button onClick={()=>setAction("login")} light color="info" text="Login"/>
                    </div>
                    <div className={"message " + errorColor + " is-small margined-auto"+ (error ? "" : " hidden")}>
                        <div className="message-header">
                            <p>{errorTitle}</p>
                        </div>
                        <div className="message-body">
                            {errorContent}
                        </div>
                    </div>
                </div>
                <img src="/img/stone.svg"/>
            </div>
        );
    }
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(AppBody);