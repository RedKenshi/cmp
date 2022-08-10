import React from "react";

const NeedActivation = props => {
    return(
        <div className="need-activation-container">
            <div className={"message is-danger"}>
                <div className="message-header">
                    <p>Disabled account</p>
                </div>
                <div className="message-body">
                    <figure className="image pointable is-128x128 margined32">
                        <img src={"/img/locked.svg"} alt="locked"/>
                    </figure>
                    Sorry you account is not activated
                    <br/>
                    Please contact an administrator to activate it
                </div>
            </div>
        </div>
    )
}

export default NeedActivation;