import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import StructureRow from "../molecules/StructureRow";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Structure = props => {

    const fieldTypes = [
        {
            typeName:"basic", icon:"brackets-curly", label:"Basic",
            types:[
                {name:"basic1",label:"Basic 1"},
                {name:"basic2",label:"Basic 2"},
                {name:"basic3",label:"Basic 3"}
            ]
        },
        {
            typeName:"physic", icon:"ruler-triangle", label:"Mesures physique",
            types:[
                {name:"physic1",label:"Physic 1"},
                {name:"physic2",label:"Physic 2"},
                {name:"physic3",label:"Physic 3"}
            ]
        },
        {
            typeName:"time", icon:"calendar-clock", label:"Temporel",
            types:[
                {name:"time1",label:"Time 1"},
                {name:"time2",label:"Time 2"},
                {name:"time3",label:"Time 3"}
            ]
        },
        {
            typeName:"coord", icon:"at", label:"Coordonées",
            types:[
                {name:"coord1",label:"Coord 1"},
                {name:"coord2",label:"Coord 2"},
                {name:"coord3",label:"Coord 3"}
            ]
        },
        {
            typeName:"money", icon:"coin", label:"Monétaire",
            types:[
                {name:"money1",label:"Money 1"},
                {name:"money2",label:"Money 2"},
                {name:"money3",label:"Money 3"}
            ]
        },
        {
            typeName:"complex",icon:"file-alt", label:"Complèxe",
            types:[
                {name:"complex1",label:"Complex 1"},
                {name:"complex2",label:"Complex 2"},
                {name:"complex3",label:"Complex 3"}
            ]
        },
        {
            typeName:"doc",icon:"square-list", label:"Documents",
            types:[
                {name:"doc1",label:"Doc 1"},
                {name:"doc2",label:"Doc 2"},
                {name:"doc3",label:"Doc 3"}
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
        type:'String'
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
            }
            label
            name
        }
    }`;
    const addFieldToStructureQuery = gql`mutation addFieldToStructure($_id: String!,$label: String, $name: String, $type: String!){
        addFieldToStructure(_id:$_id, label:$label, name:$name, type:$type){
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
                type:type
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
        console.log(e)
        console.log(e.target)
        setFieldValues({
            ...fieldValues,
            [e.target.name] : e.target.value
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
                                Fields
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
                                    return(
                                        <a className="panel-block">
                                            <span className="panel-icon">
                                            <i className={"fa-"+props.fastyle+" fa-brackets-curly"} aria-hidden="true"></i>
                                            </span>
                                            {f.label}
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
                            <p className="modal-card-title">Ajouter un champ à la structure</p>
                            <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                        </header>
                        <section className="modal-card-body is-fullwidth">
                            <input className="input is-link is-fullwidth" type="text" placeholder="Nom de la structure" onChange={handleFieldChange} name="label"/>
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