import React from 'react';
import { UserContext } from '../../contexts/UserContext';

export const FAFree = props => {
    return (
        <i style={props.style} className={"fafree "+ props.color + " " + props.code}></i>
    )
}

export default FAFree;