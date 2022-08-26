import React, { useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';

export const CrudEntityRow = props => {

    useEffect(()=>{
        console.log(props.crudEntity);
    },[])

    return (
        <tr>
            {props.crudEntity.columns.map(c=>
                <td key={c.fieldId}>{c.value}</td>
            )}
            <td>
                <button className="button is-small is-danger is-light">
                    <i className={"fa-" + props.fastyle + " fa-trash"}></i>
                </button>
            </td>
        </tr>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(CrudEntityRow);