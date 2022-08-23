import React from 'react';
import { UserContext } from '../../contexts/UserContext';

const AppBody = props => {
    return (
        <div className="home-container">
            <section className="one-screen-height padded-top64 flex flex-column align flex-between">
                <figure onClick={()=>setModalState("avatar")} className="image is-128x128">
                    <img src={"/avatar/"+props.avatar+".svg"} alt="Placeholder image"/>
                </figure>
                <p className="title">
                    Welcome
                </p>
                <p className="subtitle">
                    {props.user.firstname + " " + props.user.lastname}
                </p>
                <h1 className="cmp-title-container">
                    <span className="cmp-title">Customizable Management Platform</span>
                </h1>
            </section>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(AppBody);