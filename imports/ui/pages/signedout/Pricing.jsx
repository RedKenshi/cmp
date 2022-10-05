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
                        <div class="pricing-plan">
                            <div class="plan-header">Starter</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>20</span>/month</div>
                            <div class="plan-items">
                            <div class="plan-item">20GB Storage</div>
                            <div class="plan-item">100 Domains</div>
                            <div class="plan-item">-</div>
                            <div class="plan-item">-</div>
                            </div>
                            <div class="plan-footer">
                            <button class="button is-fullwidth" disabled="disabled">Current plan</button>
                            </div>
                        </div>
                        <div class="pricing-plan is-primary">
                            <div class="plan-header">Startups</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>40</span>/month</div>
                            <div class="plan-items">
                            <div class="plan-item">20GB Storage</div>
                            <div class="plan-item">25 Domains</div>
                            <div class="plan-item">1TB Bandwidth</div>
                            <div class="plan-item">-</div>
                            </div>
                            <div class="plan-footer">
                            <button class="button is-fullwidth">Choose</button>
                            </div>
                        </div>
                        <div class="pricing-plan is-secondary">
                            <div class="plan-header">Growing Team</div>
                            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>60</span>/month</div>
                            <div class="plan-items">
                            <div class="plan-item">200GB Storage</div>
                            <div class="plan-item">50 Domains</div>
                            <div class="plan-item">1TB Bandwidth</div>
                            <div class="plan-item">100 Email Boxes</div>
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