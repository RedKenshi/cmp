import React from 'react';
import { UserContext } from '../../../contexts/UserContext';
import SignedOutHeader from '../../molecules/SignedOutHeader'
import Waves from '../../atoms/Waves';
import { useNavigate } from 'react-router-dom';

const Landing = props => {

    const navigate = useNavigate();

    return (
        <div className="public-landing">
            <SignedOutHeader active="home"/>
            <div className="illustration-section section-wrapper">
                <div className="section">
                    <div className='text-half half'>
                        <h1>Manage your data, documents, KPIs ... from A to Z.</h1><br/>
                        <p>CPM is a no-code, fully customizable, management platform.</p><br/>
                        <button className='cta-discover button is-primary is-medium' onClick={()=>navigate("/how-it-works")}>
                            <span>Discover CMP</span>
                            <span className="icon">
                                <i className='fa-duotone fa-chevrons-right'/>
                            </span>
                        </button>
                    </div>
                    <div className='illustration-half half'>
                        <img className='illustration' src="/img/cmp-file.svg"/>
                    </div>
                </div>
            </div>
            <Waves above="#fff" below="#B8C6DB"/>
            <div className="illustration-section section-wrapper" style={{background:"#B8C6DB"}}>
                
            </div>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default withUserContext(Landing);