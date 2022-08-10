import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import StructureRow from "../molecules/StructureRow";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Structure = props => {

    const { uid } = useParams();
    const [loading, setLoading] = useState(true)
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

    const addFieldToStructure = () => {
        props.client.mutate({
            mutation:addFieldToStructureQuery,
            variables:{
                _id:structureRaw._id,
                label:fieldValues.label,
                name:fieldValues.name,
                type:fieldValues.type
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
                        <button  className="button is-danger is-fullwidth">
                            Delete structure
                        </button>
                    </div>
                    <div className="column rows">
                        <h1 className="block title is-1" >{structureRaw.label}</h1>
                        <nav className="panel is-primary">
                            <p className="panel-heading">
                                Fields
                            </p>
                            <div className="panel-block">
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Search"/>
                                    <span className="icon is-left">
                                        <i className="fas fa-search" aria-hidden="true"></i>
                                    </span>
                                </p>
                                <button className="button is-primary" onClick={()=>showModalAdd(0)}>Add</button>
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
                            <p className="modal-card-title">Créer une structure</p>
                            <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                        </header>
                        <section className="modal-card-body">
                        <div className="field">
                            <label className="label">Label</label>
                            <div className="control">
                                <input className="input" type="text" onChange={handleFieldChange} name="label"/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Nom</label>
                            <div className="control">
                                <input className="input" type="text" onChange={handleFieldChange} name="name"/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Type</label>
                            <div className="control">
                                <div className="select">
                                    <select name="type" onChange={handleFieldChange}>
                                        <option>String</option>
                                        <option>Int</option>
                                        <option>Float</option>
                                        <option>Date</option>
                                        <option>Time</option>
                                        <option>Date & Time</option>
                                        <option>Currency</option>
                                        <option>Money</option>
                                        <option>Color</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalAdd}>
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-primary" onClick={addFieldToStructure}>
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