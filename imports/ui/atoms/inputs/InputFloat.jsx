

import React from 'react';

export default InputFloat = props => {

    return (
        <div key={props.field._id} className='field'>
            <p className="control has-icons-right">
            <input type="number" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" className={"input" + (props.field.requiredAtCreation ? " is-primary" : " is-link")} placeholder={props.field.label} name={props.field._id} onChange={props.onChange} />
                <span className={"icon is-small is-right" + (props.field.requiredAtCreation ? " is-primary" : " is-link")}>
                <i className={"fa-solid " + (props.field.requiredAtCreation ? " fa-circle-exclamation" : " fa-brackets-curly")}></i>
                </span>
            </p>
        </div>
    )
}