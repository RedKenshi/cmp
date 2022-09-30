import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import Carl from '../atoms/Carl';
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
            <div className="landing-container columns">
                <div className='column is-half'>
                    <Carl />
                </div>
                <div className='column is-half'>
                    <form className="form children-spaced">
                        <h1>Welcome please login or register</h1>
                        <input className="input is-primary" name="mail" placeholder="mail" onChange={handleChange}/>
                        <input className="input is-primary" name="pass" placeholder="pass" onChange={handleChange} type="password"/>
                        <button className='margined-bottom16 button is-primary' onClick={login} icon={"fa-"+props.fastyle + " fa-arrow-right"}>Se connecter</button>
                        <button className='button is-primary is-outlined text-center center' onClick={()=>setAction({action:"register"})}>Créer un compte</button>
                    </form>
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
            <div className="landing-container columns">
                <div className='column is-half'>
                    <Carl />
                </div>
                <div className='column is-half'>
                    <form className="form box children-spaced">
                        <h1>Welcome please login or register</h1>
                        <input className="input is-primary" name="newmail" placeholder="mail" onChange={handleChange}/>
                        <input className="input is-primary" name="firstname" placeholder="firstname" onChange={handleChange}/>
                        <input className="input is-primary" name="lastname" placeholder="lastname" onChange={handleChange}/>
                        <input className="input is-primary" name="newpass" placeholder="pass" onChange={handleChange} type="password"/>
                        <input className="input is-primary" name="newpassconfirm" placeholder="confirm pass" onChange={handleChange} type="password"/>
                        <div className={"message " + errorColor + " is-small margined-auto"+ (error ? "" : " hidden")}>
                            <div className="message-body">
                                <p><strong>{errorTitle}</strong></p>
                                <p>{errorContent}</p>
                            </div>
                        </div>
                        <button disabled={error} className='margined-bottom16 button is-primary' onClick={(error ? ()=>{} : register)} icon={"fa-"+props.fastyle + " fa-arrow-right"}>Créer le compte</button>
                        <button className='button is-primary is-outlined text-center center' onClick={()=>setAction("login")}>J'ai déjà un compte</button>
                    </form>
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