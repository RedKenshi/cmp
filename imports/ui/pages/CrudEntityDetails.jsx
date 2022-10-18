import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

export const CrudEntityDetails = props => {
    
    const navigate = useNavigate();
    const { _id } = useParams();
    const fieldTypes = [
        {
            typeName:"required",
            color:"primary",
            icon:"circle-exclamation",
            label:"Champs requis"
        },
        {
            typeName:"optional",
            color:"link",
            icon:"brackets-curly",
            label:"Champs optionnels"
        }
    ]
    const [modalActiveFieldType, setModalActiveFieldType] = useState("required")
    const [structureInstanceRaw,setStructureInstanceRaw] = useState([]);
    const [structureInstanceFieldValues,setStructureInstanceFieldValues] = useState([]);
    const [structureRaw,setStructureRaw] = useState([]);
    const [structureId,setStructureId] = useState([]);
    const [loadingStructure,setLoadingStructure] = useState(true);
    const [loadingInstance,setLoadingInstance] = useState(true);
    const [openModalDate,setOpenModalDate] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openModalDelete,setOpenModalDelete] = useState(false);
    const [deleteTarget,setDeleteTarget] = useState("");
    const [deleteTargetId,setDeleteTargetId] = useState("");

    const structureQuery = gql` query structure($_id: String!) {
        structure(_id:$_id) {
            _id
            icon
            fields{
                _id
                label
                name
                type
                requiredAtCreation
            }
            label
            name
        }
    }`;
    const structureInstanceQuery = gql` query structureInstance($structureId:String!,$instanceId:String!) {
        structureInstance(structureId:$structureId,instanceId:$instanceId) {
            _id
            columns{
                fieldId
                value
            }
        }
    }`;
    const loadStructure = () => {
        props.client.query({
            query:structureQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:props.layoutOptions.structureId,
            }
        }).then(({data})=>{
            setFieldsOrder(data.structure.fields.map(f=>{
                return({_id:f._id,label:f.label})
            }));
            setStructureRaw(data.structure);
            setStructureId(data.structure._id);
            loadStructureInstances(data.structure._id);
            setLoadingStructure(false)
        })
    }
    const loadStructureInstance = () => {
        props.client.query({
            query:structureInstanceQuery,
            fetchPolicy:"network-only",
            variables:{
                structureId:props.layoutOptions.structureId,
                instanceId:_id
            }
        }).then(({data})=>{
            setStructureInstanceRaw(data.structureInstance);
            setLoadingInstance(false)
        })
    }
    useEffect(()=>{
        loadStructure();
        loadStructureInstance();
    },[])

    return (
        <div className="padded128">
            <div className="columns">
                <div className='box column is-narrow padded32'>
                    <button onClick={()=>navigate("lab")}>Edit in lab</button>
                </div>
                <div className="box column padded-32">
                    {JSON.stringify(structureRaw)}
                    {JSON.stringify(structureInstanceRaw)}
                </div>
            </div>
        </div>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(CrudEntityDetails);