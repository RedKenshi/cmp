import React, { useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';

export const CrudEntityRow = props => {

    useEffect(()=>{
        //console.log(props.crudEntity);
    },[])

    return (
        <tr>
            {props.crudEntity.columns.map(c=>
                <td key={c.fieldId}>{c.value}</td>
            )}
            <td className='flex align nowrap'>
                <button className="button is-small is-danger is-light">
                    <i className={"fa-" + props.fastyle + " fa-trash"}></i>
                </button>
                <button className="button is-small is-link is-light" >
                    <i className={"fa-" + props.fastyle + " fa-magnifying-glass"}></i>
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