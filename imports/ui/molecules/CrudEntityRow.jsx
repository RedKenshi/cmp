import React, { useEffect, useState }  from 'react';
import { UserContext } from '../../contexts/UserContext';

export const CrudEntityRow = props => {

    const [columns,setColumns] = useState([]);

    useEffect(()=>{
        let vals = {};
        props.crudEntity.columns.forEach(col=>{vals[col.fieldId] = col.value})
        setColumns(vals);
    },[]);

    return (
        <tr key={props.key}>
            {props.fields.map(f=>{
                if(columns[f._id]){
                    return(<td key={f._id}>{columns[f._id]}</td>)
                }else{
                    return(<td key={f._id}>-</td>)
                }
            })}
            <td className='flex align nowrap'>
                <button className="button is-small is-link is-light" >
                    <i className={"fa-" + props.fastyle + " fa-magnifying-glass"}></i>
                </button>
                <button onClick={()=>{props.showModalDelete(props.crudEntity._id)}} className="button is-small is-danger is-light">
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