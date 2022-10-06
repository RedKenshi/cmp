import React from 'react';
import { UserContext } from '../../../contexts/UserContext';
import SignedOutHeader from '../../molecules/SignedOutHeader';

const Pricing = props => {

    return (
        <div className="public-landing">
            <SignedOutHeader active="pricing"/>
            <div className="pricing-section section-wrapper">
                <div class="section">
                    <div class="pricing-table">
                        <div class="pricing-plan is-info">
                            <div class="plan-header">Starter</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>20</span>/month</div>
                            <div class="plan-items">
                                <div class="plan-item">10 Stuctures</div>
                                <div class="plan-item">25 Pages</div>
                                <div class="plan-item">-</div>
                                <div class="plan-item">-</div>
                            </div>
                            <div class="plan-footer">
                            <button class="button is-fullwidth">Choose</button>
                            </div>
                        </div>
                        <div class="pricing-plan is-dark">
                            <div class="plan-header">Serious</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>40</span>/month</div>
                            <div class="plan-items">
                                <div class="plan-item">20 Stuctures</div>
                                <div class="plan-item">100 Pages</div>
                                <div class="plan-item">5 GB Storage</div>
                                <div class="plan-item">-</div>
                            </div>
                            <div class="plan-footer">
                            <button class="button is-fullwidth">Choose</button>
                            </div>
                        </div>
                        <div class="pricing-plan is-primary">
                            <div class="plan-header">Mastodon</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>80</span>/month</div>
                            <div class="plan-items">
                                <div class="plan-item">100 Stuctures</div>
                                <div class="plan-item">Unlimited Pages</div>
                                <div class="plan-item">100 GB Storage</div>
                                <div class="plan-item"></div>
                            </div>
                            <div class="plan-footer">
                            <button class="button is-fullwidth">Choose</button>
                            </div>
                        </div>
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
  
export default withUserContext(Pricing);