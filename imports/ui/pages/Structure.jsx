import React, { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';

const Structure = props => {
    const { _id } = useParams();
    const [loading, setLoading] = useState(true)
    const [modalActiveFieldType, setModalActiveFieldType] = useState("basic")
    const [formValues, setFormValues] = useState({
        label:'',
        name:''
    });
    const [fieldValues, setFieldValues] = useState({
        label:'',
        name:'',
        type:'string',
        requiredAtCreation: "off",
        searchable: "off"
    });
    const [deleteTargetId, setDeleteTargetId] = useState("");
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [modalAddStep, setModalAddStep] = useState(0)
    const [selectedFieldType, setSelectedFieldType] = useState("")
    const [openModalDelete,setOpenModalDelete] = useState(false);
    const [openModalDeleteField,setOpenModalDeleteField] = useState(false);
    const [deleteFieldTarget,setDeleteFieldTarget] = useState(false);
    const [structureRaw, setStructureRaw] = useState(null);

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
    const addFieldToStructureQuery = gql`mutation addFieldToStructure($_id: String!,$label: String, $name: String, $type: String!, $requiredAtCreation: Boolean!, $searchable: Boolean!){
        addFieldToStructure(_id:$_id, label:$label, name:$name, type:$type, requiredAtCreation:$requiredAtCreation, searchable:$searchable){
            status
            message
        }
    }`;
    const deleteStructureQuery = gql`mutation deleteStructure($_id:String!){
        deleteStructure(_id:$_id){
            status
            message
        }
    }`;
    const deleteFieldFromStructureQuery = gql`mutation deleteFieldFromStructure($_id:String!){
        deleteFieldFromStructure(_id:$_id){
            status
            message
        }
    }`;

    const addFieldToStructure = () => {
        props.client.mutate({
            mutation:addFieldToStructureQuery,
            variables:{
                _id:structureRaw._id,
                label:fieldValues.label,
                name:fieldValues.label.toLowerCase().replace(" ",""),
                type:selectedFieldType,
                requiredAtCreation:(fieldValues.requiredAtCreation == "on" ? true : false),
                searchable:(fieldValues.searchable == "on" ? true : false)
            }
        }).then((data)=>{
            loadStructure();
            closeModalAdd()
            props.toastQRM(data.data.addFieldToStructure)
        })
    }
    const deleteFieldFromStructure = () => {
        props.client.mutate({
            mutation:deleteFieldFromStructureQuery,
            variables:{
                _id:deleteFieldTarget
            }
        }).then((data)=>{
            loadStructure();
            closeModalDeleteField()
            props.toastQRM(data.data.deleteFieldFromStructure)
        })
    }
    
    const handleFormChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }
    const handleFieldChange = e => {
        setFieldValues({
            ...fieldValues,
            [e.target.name] : e.target.value
        })
    }
    const resetFieldsValue = () => {
        if(document.getElementById("fieldCreationRequired")){
            document.getElementById("fieldCreationRequired").checked = false;
        }
        if(document.getElementById("searchable")){
            document.getElementById("searchable").checked = false;
        }
        if(document.getElementById("tableview")){
            document.getElementById("tableview").checked = false;
        }
        setModalAddStep(0)
        setFieldValues({
            label:'',
            name:'',
            type:'string',
            requiredAtCreation: "off",
            searchable: "off",
            tableview: "off"
        })
    }
    const deleteStructure = () => {
        props.client.mutate({
            mutation:deleteStructureQuery,
            variables:{
            _id:deleteTargetId
            }
        }).then((data)=>{
            loadStructure();
            closeModalDelete()
            props.toastQRM(data.data.deleteStructure)
        })
    }
    const showModalAdd = () => {
        setOpenModalAdd(true)
    }
    const closeModalAdd = () => {
        resetFieldsValue();
        setOpenModalAdd(false)
    }
    const showModalDelete = _id => {
        setDeleteTargetId(_id);
        setOpenModalDelete(true)
    }
    const closeModalDelete = () => {
        setOpenModalDelete(false)
    }
    const showModalDeleteField = _id => {
        setDeleteFieldTarget(_id)
        setOpenModalDeleteField(true)
    }
    const closeModalDeleteField = () => {
        setOpenModalDeleteField(false)
    }
    const loadStructure = () => {
        props.client.query({
            query:structureQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:_id,
            }
        }).then(({data})=>{
            setStructureRaw(data.structure);
            setLoading(false)
        })
    }
    const getFieldTypeMenu = () => {
        return (
            <ul >
                {props.fieldTypes.map(ft=>{
                    return (
                        <li className={(modalActiveFieldType == ft.typeName ? "is-active" : "")}>
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
    const getSelectedFieldTypeSubtype = () => {
        return (
            <tbody>
                {props.fieldTypes.filter(ft=>ft.typeName == modalActiveFieldType)[0].types.map(type=>{
                    return(
                        <tr>
                            <td>{type.label}</td>
                            <td>
                                <button className="button is-small is-primary" onClick={()=>selectAddFieldType(type.name)}>
                                    <span>Choisir</span>
                                    <span className="icon">
                                        <i className="fa-light fa-chevron-right" />
                                    </span>
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    const selectAddFieldType = type => {
        setSelectedFieldType(type);
        setModalAddStep(1);
    }
    const getModalAddBody = () => {
        if(modalAddStep == 0){
            return (
                <section className="modal-card-body is-fullwidth">
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="tabs vertical margined-top16 fullwidth">
                                {getFieldTypeMenu()}
                            </div>
                        </div>
                        <div className="column">
                            <table className="table is-fullwidth is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th className="is-narrow">Actions</th>
                                    </tr>
                                </thead>
                                {getSelectedFieldTypeSubtype()}
                            </table>
                        </div>
                    </div>
                </section>
            )
        }
        if(modalAddStep == 1){
            return (
                <section className="modal-card-body">
                    <div className="rows">
                        <div className="row">
                            <input className="input is-primary is-fullwidth" type="text" placeholder="Nom de la propri??t??" onChange={handleFieldChange} name="label"/>
                        </div>
                        <div className="row flex">
                            <label className="checkbox flex align">
                                <input className="checkbox" type="checkbox" onChange={handleFieldChange} name="requiredAtCreation" id="fieldCreationRequired"/>
                                Requis ?? la cr??ation
                            </label>
                        </div>
                        <div className="row flex">
                            <label className="checkbox flex align">
                                <input className="checkbox" type="checkbox" onChange={handleFieldChange} name="searchable" id="searchable"/>
                                Searchable
                            </label>
                        </div>
                        <div className="row flex">
                            <label className="checkbox flex align">
                                <input className="checkbox" type="checkbox" onChange={handleFieldChange} name="tableview" id="tableview"/>
                                Display in table view
                            </label>
                        </div>
                    </div>
                </section>
            )
        }
    }
    const getModalAddFooter = () => {
        if(modalAddStep == 1){
            return(
                <footer className="modal-card-foot">
                    <button className='button' onClick={closeModalAdd}>
                        <span className="icon">
                            <i className='fa-light fa-arrow-left'/>
                        </span>
                        <span>Annuler</span>
                    </button>
                    <button className='button is-primary' onClick={addFieldToStructure}>
                        <span>Go</span>
                        <span className="icon">
                            <i className='fa-light fa-arrow-right'/>
                        </span>
                    </button>
                </footer>
            )
        }
    }
    useEffect(() => {
        loadStructure();
    })

    if(loading){
        return "Loading ..."
    }else{
        return (
            <Fragment>
                <div className="structure padded columns">
                    <div className="column is-narrow">
                        <AdministrationMenu active="structures"/>
                    </div>
                    <div className="column rows">
                        <div className="box">
                            <h1 className="block title is-1" >{structureRaw.label}</h1>
                        </div>
                        <nav className="panel is-primary">
                            <p className="panel-heading has-background-info-light has-text-info">
                                Propri??t??s
                            </p>
                            <div className="panel-block">
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Search"/>
                                    <span className="icon is-left">
                                        <i className={"fa-"+props.fastyle + " fa-search"} aria-hidden="true"></i>
                                    </span>
                                </p>
                                <button className="button is-primary" onClick={showModalAdd}>
                                    <i className={"fa-"+props.fastyle+" fa-plus"}></i>
                                </button>
                            </div>
                            {Array.from(structureRaw.fields).sort((a,b) => (a.requiredAtCreation === b.requiredAtCreation)? 0 : a.requiredAtCreation? -1 : 1).map(f=>{
                                return(
                                    <a className={"panel-block flex flex-between"}>
                                        <div className="flex align center">
                                            <span className="panel-icon">
                                                <i className={"fa-"+props.fastyle+" fa-brackets-curly" + (f.requiredAtCreation ? " has-text-info" : " has-text-link")} aria-hidden="true"></i>
                                            </span>
                                            {f.label}
                                            {
                                                f.requiredAtCreation ? 
                                                <i className={"margined-left8" + (f.requiredAtCreation ? " has-text-info" : " has-text-link") + " fa-" + props.fastyle + " fa-circle-exclamation"} />
                                                :
                                                ""
                                            }
                                        </div>
                                        <div className="flex align">
                                            <span className={"tag" + (f.requiredAtCreation ? " has-text-info" : " has-text-link") + " is-light"}>{props.getFieldTypeLabel(f.type)}</span>
                                            <button onClick={()=>showModalDeleteField(f._id)} className="button is-small is-danger is-light">
                                                <i className={"fa-" + props.fastyle + " fa-trash"}/>
                                            </button>
                                        </div>
                                    </a>
                                )
                            })}
                        </nav>
                    </div>
                </div>
                <div className={"modal" + (openModalAdd ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Ajouter une propri??t?? ?? la structure</p>
                            <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                        </header>
                        {getModalAddBody()}
                        {getModalAddFooter()}
                    </div>
                </div>
                <div className={"modal" + (openModalDelete != false ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Supprimer la structure</p>
                            <button className="delete" aria-label="close" onClick={closeModalDelete}/>
                        </header>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalDelete}>
                                <span className="icon">
                                    <i className='fa-light fa-arrow-left'/>
                                </span>
                                <span>Annuler</span>
                            </button>
                            <button className="button is-danger" onClick={deleteStructure}>
                                <span>Supprimer</span>
                                <span className="icon">
                                    <i className='fa-light fa-trash'/>
                                </span>
                            </button>
                        </footer>
                    </div>
                </div>
                <div className={"modal" + (openModalDeleteField != false ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Supprimer le champs de la structure ?</p>
                            <button className="delete" aria-label="close" onClick={closeModalDeleteField}/>
                        </header>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalDeleteField}>
                                <span className="icon">
                                    <i className='fa-light fa-arrow-left'/>
                                </span>
                                <span>Annuler</span>
                            </button>
                            <button className="button is-danger" onClick={deleteFieldFromStructure}>
                                <span>Supprimer</span>
                                <span className="icon">
                                    <i className='fa-light fa-trash'/>
                                </span>
                            </button>
                        </footer>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Structure);