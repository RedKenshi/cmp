import React from 'react';
import { UserContext } from '../../../contexts/UserContext';
import SignedOutHeader from '../../molecules/SignedOutHeader'
import Waves from '../../atoms/Waves';

const HowItWorks = props => {

    return (
        <div className="public-landing">
            <SignedOutHeader active="how-it-works"/>
            <div className="illustration-section section-wrapper">
                <div className="section">
                    <div className='text-half half'>
                        <p>A no-code, fully customizable, management platform, souds good but ...</p><br/>
                        <h1 style={{whiteSpace: "nowrap"}}>How does it works ?</h1><br/>
                        <i className="scroll-down-icon fa-duotone fa-chevrons-down"/>
                    </div>
                    <div className='illustration-half half'>
                        <img className='illustration' src="/img/cmp-light.svg"/>
                    </div>
                </div>
            </div>
            <Waves above="#fff" below="#B8C6DB"/>
            <div className="illustration-section section-wrapper" style={{background:"#B8C6DB"}}>
                <div className="section">
                    <div className='illustration-half half'>
                        <img className='illustration' src="/img/cmp-alldata.svg"/>
                    </div>
                    <div className='text-half half'>
                        <h1>Describe your business through structures.</h1>
                        <p>Structures are objects that you shape at your will, using variety of differents property types.</p>
                    </div>
                </div>
            </div>
            <Waves above="#fff" below="#B8C6DB" reverse/>
            <div className="illustration-section section-wrapper" style={{background:"#fff"}}>
                <div className="section">
                    <div className='text-half half'>
                        <h1>Create your a page tree that match your needs.</h1>
                        <p>Create pages, set layout to these pages, find the best platform design to get the most value from your data.</p>
                    </div>
                    <div className='illustration-half half'>
                        <img className='illustration' src="/img/cmp-design.svg"/>
                    </div>
                </div>
            </div>
            <Waves above="#fff" below="#B8C6DB"/>
            <div className="illustration-section section-wrapper" style={{background:"#B8C6DB"}}>
                <div className="section">
                    <div className='illustration-half half'>
                        <img className='illustration' src="/img/cmp-dashboard.svg"/>
                    </div>
                    <div className='text-half half'>
                        <h1>Design dashboard based on your key indicator</h1>
                        <p>Build dashboards to display your KPI, the information you need to make the best decision</p>
                    </div>
                </div>
            </div>
            <Waves above="#fff" below="#B8C6DB" reverse/>
            <div className="illustration-section section-wrapper" style={{background:"#fff"}}>

            </div>
        </div>
    );
};

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default withUserContext(HowItWorks);