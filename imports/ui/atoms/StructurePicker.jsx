import React, { useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

const StructurePicker = props => {

    //STATE
    const [value, setValue] = useState('');
    const [needToRefresh, setNeedToRefresh] = useState(false);
    const [structuresRaw, setStructuresRaw] = useState([]);
    //ACTIONS
    //GRAPHQL QUERIES AND MUTATIONS
    const structuresQuery = gql` query structures {
        structures {
            _id
            label
            name
        }
    }`;
    //LIFECYCLE
    const loadStructures = () => {
        props.client.query({
            query:structuresQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            setStructuresRaw(data.structures)
            setNeedToRefresh(false);
            if(props.didRefresh != undefined){
                props.didRefresh()
            }
        })
    }
    useEffect(() => {
        loadStructures();
    },[])
    useEffect(()=>{
        if(needToRefresh || props.needToRefresh){
            loadStructures();
        }
    })
    
    return (
        <div className="select is-primary">
            <select onChange={props.onChange}>
                <option value="" selected disabled hidden>Choisir une structure ...</option>
                {structuresRaw.map(x=>{
                    return(
                        <option key={x._id} value={x._id}>
                            {x.label}
                        </option>
                    )
                })}
            </select>
        </div>      
    )    
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(StructurePicker);