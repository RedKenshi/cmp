import React from 'react';
import { UserContext } from '../../../contexts/UserContext';
import SignedOutHeader from '../../molecules/SignedOutHeader';

const AboutUs = props => {

    return (
        <div className="public-landing">
            <SignedOutHeader active="about-us"/>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default withUserContext(AboutUs);