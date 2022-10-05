import React from 'react';
import { UserContext } from '../../contexts/UserContext';
import Carl from '../atoms/Carl';

const Home = props => {
    return (
        <div className="home-container one-screen-height">
            <section className='flex align flex-column'>
                <p className="title">
                    Welcome
                </p>
                <p className="subtitle">
                    {props.user.firstname + " " + props.user.lastname}
                </p>
            </section>
            <div>
                <Carl />
            </div>
            <h1 className="cmp-title-container">
                <span className="cmp-title">Customizable Management Platform</span>
            </h1>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(Home);