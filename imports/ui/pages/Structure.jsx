import React, { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';

const Structure = props => {

    const fieldTypes = [
        {
            typeName:"basic", icon:"brackets-curly", label:"Basic",
            types:[
                {name:"string",label:"Texte"},
                {name:"int",label:"Nombre entier"},
                {name:"float",label:"Nombre décimal"},
                {name:"percent",label:"Pourcentage"},
            ]
        },
        {
            typeName:"physic", icon:"ruler-triangle", label:"Mesures physique",
            types:[
                {name:"weight",label:"Poid"},
                {name:"volume",label:"Volume"},
                {name:"gps",label:"Coordonées GPS"},
                {name:"distance",label:"Distance"},
                {name:"angle",label:"Angle"},
                {name:"length",label:"Longeur"},
                {name:"height",label:"Hauteur"},
                {name:"width",label:"Largeur"}
            ]
        },
        {
            typeName:"time", icon:"calendar-clock", label:"Temporel",
            types:[
                {name:"date",label:"Date"},
                {name:"time",label:"Heure"},
                {name:"timestamp",label:"Instant"},
                {name:"duration",label:"Durée"},
                {name:"range",label:"Tranche horaire"}
            ]
        },
        {
            typeName:"coord", icon:"at", label:"Coordonées",
            types:[
                {name:"phone",label:"Téléphone"},
                {name:"link",label:"Lien"},
                {name:"mail",label:"Adresse e-mail"},
                {name:"address",label:"Adresse"},
                {name:"instagram",label:"Instagram"},
                {name:"twitter",label:"Twitter"},
                {name:"discord",label:"Discord"}
            ]
        },
        {
            typeName:"money", icon:"coin", label:"Monétaire",
            types:[
                {name:"amount",label:"Montant"},
                {name:"currency",label:"Monnaie"}
            ]
        },
        {
            typeName:"complex",icon:"file-alt", label:"Complexe",
            types:[
                {name:"rating",label:"Notation"},
                {name:"user",label:"Utilisateur"},
                {name:"step",label:"Processus"}
            ]
        },
        {
            typeName:"doc",icon:"square-list", label:"Documents",
            types:[
                {name:"pdf",label:"Fichier PDF"},
                {name:"file",label:"Fichier tout format"}
            ]
        },
        {
            typeName:"custom",icon:"atom", label:"Custom",
            types:[
                {name:"custom1",label:"Custom 1"},
                {name:"custom2",label:"Custom 2"},
                {name:"custom3",label:"Custom 3"}
            ]
        },
    ]

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
    setFieldValues
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
                {fieldTypes.map(ft=>{
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
                {fieldTypes.filter(ft=>ft.typeName == modalActiveFieldType)[0].types.map(type=>{
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
                                Delete structure
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
                            {
                                structureRaw.fields.map(f=>{
                                    console.log(f);
                                    return(
                                        <a className="panel-block">
                                            <span className="panel-icon">
                                            <i className={"fa-"+props.fastyle+" fa-brackets-curly"} aria-hidden="true"></i>
                                            </span>
                                            {f.label}
                                            {
                                                f.requiredAtCreation ? 
                                                <i className={"margined-left8 has-text-link fa-" + props.fastyle + " fa-circle-exclamation"} />
                                                :
                                                ""
                                            }
                                        </a>
                                    )
                                })
                            }
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