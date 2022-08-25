import React, { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';

const Structure = props => {

    const { uid } = useParams();
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
        requiredAtCreation: "off"
    });
    const [deleteTargetId, setDeleteTargetId] = useState("");
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openModalDelete,setOpenModalDelete] = useState(false);
    const [openModalDeleteField,setOpenModalDeleteField] = useState(false);
    const [deleteFieldTarget,setDeleteFieldTarget] = useState(false);
    const [structureRaw, setStructureRaw] = useState(null);

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
    const addFieldToStructureQuery = gql`mutation addFieldToStructure($_id: String!,$label: String, $name: String, $type: String!, $requiredAtCreation: Boolean!){
        addFieldToStructure(_id:$_id, label:$label, name:$name, type:$type, requiredAtCreation:$requiredAtCreation){
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

    const addFieldToStructure = type => {
        props.client.mutate({
            mutation:addFieldToStructureQuery,
            variables:{
                _id:structureRaw._id,
                label:fieldValues.label,
                name:fieldValues.label.toLowerCase().replace(" ",""),
                type:type,
                requiredAtCreation:(fieldValues.requiredAtCreation == "on" ? true : false)
            }
        }).then((data)=>{
            loadStructure();
            closeModalAdd()
            props.toastQRM(data.data.addFieldToStructure)
        })
    }
    const deleteFieldFromStructure = type => {
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
        document.getElementById("fieldCreationRequired").checked = false;
        setFieldValues({
            label:'',
            name:'',
            type:'string',
            requiredAtCreation: "off"
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
    const showModalAdd = uid => {
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
                uid:parseInt(uid),
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
                                <button className="button is-small is-primary" onClick={()=>addFieldToStructure(type.name)}>Ajouter</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
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
                        <div className="box rows">
                            <button  className="button is-danger is-fullwidth">
                                Action 1
                            </button>
                        </div>
                    </div>
                    <div className="column rows">
                        <div className="box">
                            <h1 className="block title is-1" >{structureRaw.label}</h1>
                        </div>
                        <nav className="panel is-link">
                            <p className="panel-heading has-background-link-light has-text-link">
                                Propriétés
                            </p>
                            <div className="panel-block">
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Search"/>
                                    <span className="icon is-left">
                                        <i className={"fa-"+props.fastyle + " fa-search"} aria-hidden="true"></i>
                                    </span>
                                </p>
                                <button className="button is-light is-link" onClick={()=>showModalAdd(0)}>
                                    <i className={"fa-"+props.fastyle+" fa-plus"}></i>
                                </button>
                            </div>
                            {Array.from(structureRaw.fields).sort((a,b) => (a.requiredAtCreation === b.requiredAtCreation)? 0 : a.requiredAtCreation? -1 : 1).map(f=>{
                                return(
                                    <a className={"panel-block flex flex-between"}>
                                        <div className="flex align center">
                                            <span className="panel-icon">
                                                <i className={"fa-"+props.fastyle+" fa-brackets-curly" + (f.requiredAtCreation ? " has-text-primary" : " has-text-link")} aria-hidden="true"></i>
                                            </span>
                                            {f.label}
                                            {
                                                f.requiredAtCreation ? 
                                                <i className={"margined-left8" + (f.requiredAtCreation ? " has-text-primary" : " has-text-link") + " fa-" + props.fastyle + " fa-circle-exclamation"} />
                                                :
                                                ""
                                            }
                                        </div>
                                        <div className="flex align">
                                            <span className={"tag" + (f.requiredAtCreation ? " has-text-primary" : " has-text-link") + " is-light"}>{props.getFieldTypeLabel(f.type)}</span>
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
                <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Ajouter une propriété à la structure</p>
                            <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                        </header>
                        <section className="modal-card-body is-fullwidth">
                            <div className="columns is-fullwidth">
                                <div className="column">
                                    <input className="input is-link is-fullwidth" type="text" placeholder="Nom de la propriété" onChange={handleFieldChange} name="label"/>
                                </div>
                                <div className="column is-narrow flex">
                                    <label className="checkbox flex align">
                                        <input className="checkbox" type="checkbox" onChange={handleFieldChange} name="requiredAtCreation" id="fieldCreationRequired"/>
                                        Requis à la création
                                    </label>
                                </div>
                            </div>
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
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-danger" onClick={deleteStructure}>
                                <i className='fa-light fa-trash'/>
                                Supprimer
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
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-danger" onClick={deleteFieldFromStructure}>
                                <i className='fa-light fa-trash'/>
                                Supprimer
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