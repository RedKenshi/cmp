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
                <div className="form flex flex-column align center children-spaced">
                    <img className='margined-bottom64 image is-256x256' src="/img/object.svg"/>
                    <h1>Welcome please login or register</h1>
                    <input className="input is-primary" name="mail" placeholder="mail" onChange={handleChange}/>
                    <input className="input is-primary" name="pass" placeholder="pass" onChange={handleChange} type="password"/>
                    <button className='margined-bottom16 button is-success' onClick={login} icon={"fa-"+props.fastyle + " fa-arrow-right"}>Se connecter</button>
                    <a className='text-center is-link center' onClick={()=>setAction({action:"register"})}>Créer un compte</a>
                </div>
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
                <div className="form flex flex-column align center children-spaced">
                    <img className='margined-bottom32 image is-128x128' src="/img/object.svg"/>
                    <h1>Welcome please login or register</h1>
                    <input className="input is-link" name="newmail" placeholder="mail" onChange={handleChange}/>
                    <input className="input is-link" name="firstname" placeholder="firstname" onChange={handleChange}/>
                    <input className="input is-link" name="lastname" placeholder="lastname" onChange={handleChange}/>
                    <input className="input is-link" name="newpass" placeholder="pass" onChange={handleChange} type="password"/>
                    <input className="input is-link" name="newpassconfirm" placeholder="confirm pass" onChange={handleChange} type="password"/>
                    <div className={"message " + errorColor + " is-small margined-auto"+ (error ? "" : " hidden")}>
                        <div className="message-header">
                            <p>{errorTitle}</p>
                        </div>
                        <div className="message-body">
                            {errorContent}
                        </div>
                    </div>
                    <button disabled={error} className='margined-bottom16 button is-success' onClick={(error ? ()=>{} : register)} icon={"fa-"+props.fastyle + " fa-arrow-right"}>Créer le compte</button>
                    <a className='text-center is-link center' onClick={()=>setAction("login")}>J'ai déjà un compte</a>
                </div>
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