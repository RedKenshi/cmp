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
        entityUID
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
        <div class="select is-link">
            <select onChange={props.onChange}>
                <option value="" selected disabled hidden>Choisir une structure ...</option>
                {structuresRaw.map(x=>{
                    return(
                        <option value={x.entityUID}>
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