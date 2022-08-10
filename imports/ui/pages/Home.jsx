import React from 'react';
import { UserContext } from '../../contexts/UserContext';

const AppBody = props => {
    return (
        <div className="home-container">
            <section className="one-screen-height padded-top128 flex flex-column flex-between">
                <div className="hero is-link is-medium glass padded-left64 between">
                    <figure onClick={()=>setModalState("avatar")} className="image is-192x192">
                        <img src={"/avatar/"+props.avatar+".svg"} alt="Placeholder image"/>
                    </figure>
                    <div className="hero-body">
                        <p className="title">
                            Welcome
                        </p>
                        <p className="subtitle">
                            {props.user.firstname + " " + props.user.lastname}
                        </p>
                    </div>
                </div>
                <div className="margined-bottom64 flex center flex-column align">
                    <h1 className="cmp-title-container">
                        <span className="cmp-title">Customizable Management Platform</span>
                    </h1>
                </div>
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