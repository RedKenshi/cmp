import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignedOutHeader = props => {
    const navigate = useNavigate();
    return (
        <section className="signed-out-header hero is-dark">
            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                    <div className="container">
                        <ul>
                            <li className={props.active == "home" ? "is-active" : ""} onClick={props.active == "home" ? null : ()=>navigate("/home")}>
                                <a>Home</a>
                            </li>
                            <li className={props.active == "how-it-works" ? "is-active" : ""} onClick={props.active == "how-it-works" ? null : ()=>navigate("/how-it-works")}>
                                <a>How it works</a>
                            </li>
                            <li className={props.active == "pricing" ? "is-active" : ""} onClick={props.active == "pricing" ? null : ()=>navigate("/pricing")}>
                                <a>Pricing</a>
                            </li>
                            <li className={props.active == "about-us" ? "is-active" : ""} onClick={props.active == "about-us" ? null : ()=>navigate("/about-us")}>
                                <a>About us</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className='cmp-logo'>
                <h1>CMP</h1>
            </div>
            <button className="button is-outlined is-primary sign-in" onClick={()=>navigate("/sign-in")}>
                <span>Access your instance</span>
                <span className='icon'>
                    <i className="fa-duotone fa-arrow-right-to-bracket" />
                </span>
            </button>
        </section>
    );
};

export default SignedOutHeader;