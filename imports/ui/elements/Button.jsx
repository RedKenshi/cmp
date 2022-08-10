import React from 'react';

export const Button = props => {
    if(props.icon){
        if(props.text){
            return (
                <button disabled={props.disabled} onClick={props.onClick} className={
                    "button" + 
                    (props.size ? " is-"+props.size : "") +
                    (props.color ? " is-"+props.color : "") +
                    (props.outlined ? " is-outlined" : "") +
                    (props.light ? " is-light": "")
                }>
                    <span className={"icon"}>
                        <i className={props.icon}></i>
                    </span>
                    <span>{props.text}</span>
                </button>
            )
        }else{
            return (
                <button disabled={props.disabled} onClick={props.onClick} className={
                    "button" + 
                    (props.size ? " is-"+props.size : "") +
                    (props.color ? " is-"+props.color : "") +
                    (props.outlined ? " is-outlined" : "") +
                    (props.light ? " is-light": "")
                }>
                    <span className={"icon"}>
                        <i className={props.icon}></i>
                    </span>
                </button>
            )
        }
    }else{
        return (
            <button disabled={props.disabled} onClick={props.onClick} className={
                "button" + 
                (props.size ? " is-"+props.size : "") +
                (props.color ? " is-"+props.color : "") +
                (props.outlined ? " is-outlined" : "") +
                (props.light ? " is-light": "")
            }>
                {props.text}
            </button>
        )
    }
}

export default Button