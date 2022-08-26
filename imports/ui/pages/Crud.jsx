import React, { useState, useEffect, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import CrudEntityRow from '../molecules/CrudEntityRow';
import ModalGenericDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'graphql-tag';

export const Crud = props => {
    
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
    const [structureInstancesRaw,setStructureInstancesRaw] = useState([]);
    const [structureInstanceFieldValues,setStructureInstanceFieldValues] = useState([]);
    const [structureRaw,setStructureRaw] = useState([]);
    const [layoutOptions,setLayoutOptions] = useState(JSON.parse(props.layoutOptions));
    const [loadingStructure,setLoadingStructure] = useState(true);
    const [loadingInstances,setLoadingInstances] = useState(true);
    const [openModalDate,setOpenModalDate] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);

    const structureQuery = gql` query structure($uid: Int!) {
        structure(uid:$uid) {
            _id
            entityUID
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

    const structureInstancesQuery = gql` query structureInstances($_id:String) {
        structureInstances(_id:$_id) {
            _id
            columns{
                fieldId
                value
            }
        }
    }`;
    const addStructureInstanceQuery = gql` mutation addStructureInstance($structureId:String,$columns:[String]) {
        addStructureInstance(structureId:$structureId,columns:$columns) {
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
    const loadStructure = () => {
        props.client.query({
            query:structureQuery,
            fetchPolicy:"network-only",
            variables:{
                uid:parseInt(layoutOptions.structureEntityUID),
            }
        }).then(({data})=>{
            setStructureRaw(data.structure);
            loadStructureInstances(data.structure._id);
            setLoadingStructure(false)
        })
    }
    const loadStructureInstances = _id => {
        props.client.query({
            query:structureInstancesQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:_id
            }
        }).then(({data})=>{
            console.log(data.structureInstances)
            setStructureInstancesRaw(data.structureInstances);
            setLoadingInstances(false)
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
    const addStructureInstance = () => {
        props.client.mutate({
            mutation:addStructureInstanceQuery,
            variables:{
                structureId:structureRaw._id,
                columns:JSON.stringify(structureInstanceFieldValues)
            }
        }).then((data)=>{
            props.toastQRM(data.data.addStructureInstance)
            loadStructureInstances()
            closeModalAdd()
        })
    }

    useEffect(()=>{
        loadStructure()
    },[])

    return (
        <Fragment>
            <div className='box basic-crud-search-layout'>
                <div>
                    <input className='input' type="text"/>
                </div>
                <div>
                    <button className='button is-light is-link' onClick={()=>setOpenModalAdd(true)}>
                        <i className='fa-regular fa-plus'/>
                    </button>
                </div>
                <div className='entries-container'>
                    <table className="table is-fullwidth is-stripped is-hoverable">
                        <thead>
                            <tr>
                                {!loadingStructure && structureRaw.fields.map(f=>{
                                    return(
                                        <td>{f.label}</td>
                                    )
                                })}
                                <td className='is-narrow'>...</td>
                            </tr>
                        </thead>
                        <tbody>
                            {(!loadingInstances && structureInstancesRaw.map(ce=>{
                                return(
                                    <CrudEntityRow crudEntity={ce}/>
                                )
                            }))}
                        </tbody>
                    </table>
                </div>
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
                                    if(f.requiredAtCreation){
                                        return(
                                            <div key={f._id} className='field'>
                                                <p className="control has-icons-right">
                                                    <input className="input is-primary" placeholder={f.label} name={f._id} onChange={handleFieldInputChange} />
                                                    <span className="icon is-small is-right is-primary">
                                                        <i className="fa-solid fa-circle-exclamation"></i>
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    }else{
                                        return(
                                            <div key={f._id} className='field'>
                                                <p className="control has-icons-right">
                                                    <input className="input is-link" placeholder={f.label} name={f._id} onChange={handleFieldInputChange} />
                                                    <span className="icon is-small is-right is-primary">
                                                        <i className="fa-solid fa-brackets-curly"></i>
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalAdd}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-primary" onClick={addStructureInstance}>
                            <i className='fa-light fa-check'/>
                            Créer
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
  
export default wrappedInUserContext = withUserContext(Crud);