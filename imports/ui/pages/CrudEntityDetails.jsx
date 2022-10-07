import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import CrudEntityRow from '../molecules/CrudEntityRow';
import ModalGenericDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'graphql-tag';

export const CrudEntityDetails = props => {
    
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
    const [fieldsOrder,setFieldsOrder] = useState([])

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
    const deleteStructureInstanceQuery = gql` mutation deleteStructureInstance($structureId:String!,$instanceId:String!) {
        deleteStructureInstance(structureId:$structureId,instanceId:$instanceId) {
            status
            message
        }
    }`;
    const handleFieldInputChange = e => {
        setStructureInstanceFieldValues({
            ...structureInstanceFieldValues,
            [e.target.name] : e.target.value
        })
    }
    const onValidateDatePicker = (target,value) => {
        closeModal();
    }
    const closeModalDate = () => {
        setOpenModalDate(false)
    }
    const closeModalAdd = () => {
        setOpenModalAdd(false)
    }
    const closeModalDelete = () => {
        setOpenModalDelete(false)
    }
    const showModalDelete = () => {
        setOpenModalDelete(true)
    }
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
    const getFieldTypeMenu = () => {
        return (
            <ul >
                {fieldTypes.map(ft=>{
                    return (
                        <li key={"key"+ft.label} className={(modalActiveFieldType == ft.typeName ? "is-active" : "")}>
                            <a onClick={()=>setModalActiveFieldType(ft.typeName)}>
                                <span className="icon">
                                    <i className={"fa-"+props.fastyle + " fa-"+ft.icon} aria-hidden="true"></i>
                                </span>
                                <span>{ft.label}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        )
    }
    const deleteStructureInstance = () => {
        props.client.mutate({
            mutation:deleteStructureInstanceQuery,
            variables:{
                structureId:structureRaw._id,
                instanceId:deleteTargetId,
            }
        }).then((data)=>{
            props.toastQRM(data.data.deleteStructureInstance)
            setDeleteTargetId("");
            loadStructureInstances(structureId)
            closeModalDelete()
        })
    }
    const getInput = field => {
        let Input = props.getFieldTypeInput(field.type);
        if(Input){
            return <Input field={field} onChange={handleFieldInputChange} />
        }else{
            return <InputString field={field} onChange={handleFieldInputChange} />
        }
    }
    useEffect(()=>{
        loadStructure();
        loadStructureInstance();
    },[])

    return (
        <Fragment>
            <div className="box">
                {JSON.stringify(structureRaw)}
                <br/>
                <br/>
                <br/>
                {JSON.stringify(structureInstanceRaw)}
            </div>
            <ModalGenericDatePicker open={openModalDate} close={closeModalDate} headerLabel={"Header here"} selected={new Date()}onValidate={onValidateDatePicker} target={"datePickerTarget"}/>
            <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Créer une instance de {structureRaw.label}</p>
                        <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                    </header>
                    <div className='modal-card-body'>
                        <div className="columns">
                            <div className="column is-narrow">
                                <div className="tabs vertical margined-top16 fullwidth">
                                    {getFieldTypeMenu()}
                                </div>
                            </div>
                            <div className="column">
                                {!loadingStructure && Array.from(structureRaw.fields).filter(f => f.requiredAtCreation == (modalActiveFieldType == "required")).map(f=>{
                                    return(getInput(f))
                                })}
                            </div>
                        </div>
                    </div>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalAdd}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-primary">
                            <i className='fa-light fa-check'/>
                            Créer
                        </button>
                    </footer>
                </div>
            </div>
            <div className={"modal" + (openModalDelete != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Supprimer une instance : {structureRaw.label}</p>
                        <button className="delete" aria-label="close" onClick={closeModalDelete}/>
                    </header>
                    <div className='modal-card-body'>
                        {!loadingStructure && deleteTarget && structureRaw.fields.map(f=>{
                            if(f.requiredAtCreation){
                                return(
                                    <div className='columns info-display'>
                                        <div className='column is-half text-end'>
                                            <p>{f.label} : </p>
                                        </div>
                                        <div className='column is-half'>
                                            <span class="tag is-light is-medium">
                                                {deleteTarget.columns.filter(c=>c.fieldId == f._id)[0].value}
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalDelete}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-danger" onClick={deleteStructureInstance}>
                            <i className='fa-light fa-check'/>
                            Supprimer
                        </button>
                    </footer>
                </div>
            </div>
        </Fragment>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(CrudEntityDetails);