import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Fragment } from 'react/cjs/react.production.min';
import { UserContext } from '../../contexts/UserContext';
import Button from '../elements/Button';

const InitPlarform = props => {
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({
        firstname:'',
        lastname:'',
        mail:'',
        mailconfirm:'',
        pass:'',
        passconfirm:''
    });
    const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const handleChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }
    const initialize = () => {
        Accounts.createUser({
            email: formValues.mail,
            password: formValues.pass,
            profile: {
                firstname: formValues.firstname,
                lastname: formValues.lastname
            },
            settings:{
              isAdmin:true,
              isOwner:true              
            }
        },(err)=>{
            if(err){
                console.log(err)
                return
            }else{
                Meteor.loginWithPassword(formValues.mail, formValues.pass,
                    error=>{
                        if(!error){
                            props.loadUser();
                        }else{
                            props.toast({message:error.reason,type:"error"})
                        }
                    }
                );
                useNavigate("/app")
            }
        })
    }
    const getCurrentStepError = () => {
        if(step == 1){
            if(formValues.mail != formValues.mailconfirm){
                return("Both mail address are not matching");
            }
            if(formValues.mail == ""){
                return("Mail address is required");
            }
            if(!mailRegex.test(formValues.mail)){
                return("Mail address format invalid");
            }
            return false;
        }
        if(step == 2){
            if(formValues.firstname == "" || formValues.lastname == ""){
                return("Both fields are required");
            }
            return false;
        }
        if(step == 3){
            if(formValues.pass != formValues.passconfirm){
                return("Both password are not matching");
            }
            return false
        }
    }
    const nextStep = () => {
        setStep(step + 1)
    }
    const getMainButton = () => {
        if(step == 4){
            return(
                <button disabled={getCurrentStepError()} className='margined-bottom16 button is-primary' onClick={(getCurrentStepError() ? ()=>{} : initialize)} icon={"fa-"+props.fastyle + " fa-arrow-right"}>
                    Initialize !
                </button>
            )
        }else{
            return(
                <button className='button is-primary' disabled={getCurrentStepError()} onClick={nextStep} icon={"fa-"+props.fastyle + " fa-arrow-right"}>
                    Next
                </button>
            )
        }
    }
    const getStepFields = () => {
        if(step == 1){
            return(
                <Fragment>
                    <input className="input" key="mail" name="mail" placeholder="Mail address" onChange={handleChange}/>
                    <input className="input" key="mailconfirm" name="mailconfirm" placeholder="Confirm mail address" onChange={handleChange}/>
                </Fragment>
            )
        }
        if(step == 2){
            return(
                <Fragment>
                    <input className="input" key="firstname" name="firstname" placeholder="Your first name" onChange={handleChange}/>
                    <input className="input" key="lastname" name="lastname" placeholder="Your last name" onChange={handleChange}/>
                </Fragment>
            )
        }
        if(step == 3){
            return(
                <Fragment>
                    <input type="password" className="input" key="pass" name="pass" placeholder="Your password" onChange={handleChange}/>
                    <input type="password" className="input" key="passconfirm" name="passconfirm" placeholder="Confirm your password" onChange={handleChange}/>
                </Fragment>
            )
        }
        if(step == 4){
            return(
                <Fragment>
                    <p>{formValues.firstname + " " + formValues.lastname}</p>
                    <p>{formValues.mail}</p>
                </Fragment>
            )
        }
    }

    return (
        <div className="initialize-container columns">
            <div className='column children-spaced is-half'>
                <div className="form box children-spaced">
                    <h1>Customizable Management Platform</h1>
                    <article className="message">
                        <div className="message-header">
                            <p>This platform is yet to initialize</p>
                        </div>
                        <div className="message-body">
                            This platform instance is brand new ! No account has ever been created yet.
                            The first account added on the platform will be granted the highest administrator privileges.
                        </div>
                    </article>
                    {getStepFields()}
                    <div className={"message is-warning is-small margined-auto"+ (getCurrentStepError() ? "" : " hidden")}>
                        <div className="message-body">
                            <p>{getCurrentStepError()}</p>
                        </div>
                    </div>
                    <div className='inputs'>
                        <div className='steps'>
                            <span className={'tag is-large ' + (step >= 1 ? "" : "is-light")} icon={"fa-"+props.fastyle + " fa-arrow-right"}>{(step > 1 ? <i className="fa-duotone fa-check"/> : "1")}</span>
                            <span className={'tag is-large ' + (step >= 2 ? "" : "is-light")} icon={"fa-"+props.fastyle + " fa-arrow-right"}>{(step > 2 ? <i className="fa-duotone fa-check"/> : "2")}</span>
                            <span className={'tag is-large ' + (step >= 3 ? "" : "is-light")} icon={"fa-"+props.fastyle + " fa-arrow-right"}>{(step > 3 ? <i className="fa-duotone fa-check"/> : "3")}</span>
                        </div>
                        {getMainButton()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(InitPlarform);