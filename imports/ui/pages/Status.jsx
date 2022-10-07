import React, { useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';

const Status = props => {

    const { _id } = useParams();
    const [loading, setLoading] = useState(true)
    const [formValues, setFormValues] = useState({
        label:'',
        name:''
    });
    const [valueValues, setValueValues] = useState({
        label:''
    });
    const [deleteTargetId, setDeleteTargetId] = useState("");
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openModalDelete,setOpenModalDelete] = useState(false);
    const [openModalDeleteValue,setOpenModalDeleteValue] = useState(false);
    const [deleteFieldTarget,setDeleteFieldTarget] = useState(false);
    const [statusRaw, setStatusRaw] = useState(null);

    const statusQuery = gql` query status($_id: String!) {
        status(_id:$_id) {
            _id
            values{
                _id
                label
            }
            label
        }
    }`;
    const addValueToStatusQuery = gql`mutation addValueToStatus($_id: String!,$label: String){
        addValueToStatus(_id:$_id, label:$label){
            status
            message
        }
    }`;
    const deleteStatusQuery = gql`mutation deleteStatus($_id:String!){
        deleteStatus(_id:$_id){
            status
            message
        }
    }`;
    const deleteValueFromStatusQuery = gql`mutation deleteValueFromStatus($_id:String!){
        deleteValueFromStatus(_id:$_id){
            status
            message
        }
    }`;

    const addValueToStatus = type => {
        props.client.mutate({
            mutation:addValueToStatusQuery,
            variables:{
                _id:statusRaw._id,
                label:valueValues.label
            }
        }).then((data)=>{
            loadStatus();
            closeModalAdd()
            props.toastQRM(data.data.addValueToStatus)
        })
    }
    const deleteValueFromStatus = type => {
        props.client.mutate({
            mutation:deleteValueFromStatusQuery,
            variables:{
                _id:deleteFieldTarget
            }
        }).then((data)=>{
            loadStatus();
            closeModalDeleteValue()
            props.toastQRM(data.data.deleteValueFromStatus)
        })
    }

    const handleFormChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }
    const handleFieldChange = e => {
        setValueValues({
            ...valueValues,
            [e.target.name] : e.target.value
        })
    }
    const resetFieldsValue = () => {
        setValueValues({
            label:''
        })
    }
    const deleteStatus = () => {
        props.client.mutate({
            mutation:deleteStatusQuery,
            variables:{
            _id:deleteTargetId
            }
        }).then((data)=>{
            loadStatus();
            closeModalDelete()
            props.toastQRM(data.data.deleteStatus)
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
    const showModalDeleteValue = _id => {
        setDeleteFieldTarget(_id)
        setOpenModalDeleteValue(true)
    }
    const closeModalDeleteValue = () => {
        setOpenModalDeleteValue(false)
    }
    const loadStatus = () => {
        props.client.query({
            query:statusQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:_id,
            }
        }).then(({data})=>{
            setStatusRaw(data.status);
            setLoading(false)
        })
    }
    useEffect(() => {
        loadStatus();
    })

    if(loading){
        return "Loading ..."
    }else{
        return (
            <Fragment>
                <div className="status padded columns">
                    <div className="column is-narrow">
                        <AdministrationMenu active="statuses"/>
                        <div className="box rows">
                            <button  className="button is-danger is-fullwidth">
                                Action 1
                            </button>
                        </div>
                    </div>
                    <div className="column rows">
                        <div className="box">
                            <h1 className="block title is-1" >{statusRaw.label}</h1>
                        </div>
                        <nav className="panel is-primary">
                            <p className="panel-heading has-background-link-light has-text-link">
                                Paramètres
                            </p>
                            <a className="panel-block flex flex-between">
                                <div className="flex align center">
                                    Apparence
                                </div>
                                <div className="select is-primary">
                                    <select onChange={props.onChange}>
                                        <option value="" selected disabled hidden>Choisir une apparence ...</option>
                                        <option value="multiple">Choix multiple</option>
                                        <option value="states">Etat</option>
                                    </select>
                                </div>
                            </a>
                        </nav>
                        <nav className="panel is-primary">
                            <p className="panel-heading has-background-link-light has-text-link">
                                Valeurs
                            </p>
                            <div className="panel-block">
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Search"/>
                                    <span className="icon is-left">
                                        <i className={"fa-"+props.fastyle + " fa-search"} aria-hidden="true"></i>
                                    </span>
                                </p>
                                <button className="button is-primary" onClick={()=>showModalAdd(0)}>
                                    <i className={"fa-"+props.fastyle+" fa-plus"}></i>
                                </button>
                            </div>
                            {statusRaw.values.map(f=>{
                                return(
                                    <a className="panel-block flex flex-between">
                                        <div className="flex align center">
                                            <span className="panel-icon">
                                                <i className={"fa-"+props.fastyle+" fa-brackets-curly has-text-link"} aria-hidden="true"></i>
                                            </span>
                                            {f.label}
                                        </div>
                                        <div>
                                            <button onClick={()=>showModalDeleteValue(f._id)} className="button is-small is-danger">
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
                            <p className="modal-card-title">Ajouter une propriété à la status</p>
                            <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                        </header>
                        <section className="modal-card-body is-fullwidth">
                            <div className="columns is-fullwidth">
                                <div className="column">
                                    <input className="input is-primary is-fullwidth" type="text" placeholder="Nom de la propriété" onChange={handleFieldChange} name="label"/>
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalDelete}>
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-primary" onClick={addValueToStatus}>Ajouter</button>
                        </footer>
                    </div>
                </div>
                <div className={"modal" + (openModalDelete != false ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Supprimer la status</p>
                            <button className="delete" aria-label="close" onClick={closeModalDelete}/>
                        </header>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalDelete}>
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-danger" onClick={deleteStatus}>
                                <i className='fa-light fa-trash'/>
                                Supprimer
                            </button>
                        </footer>
                    </div>
                </div>
                <div className={"modal" + (openModalDeleteValue != false ? " is-active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Supprimer le champs de la status ?</p>
                            <button className="delete" aria-label="close" onClick={closeModalDeleteValue}/>
                        </header>
                        <footer className="modal-card-foot">
                            <button className='button' onClick={closeModalDeleteValue}>
                                <i className='fa-light fa-arrow-left'/>
                                Annuler
                            </button>
                            <button className="button is-danger" onClick={deleteValueFromStatus}>
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

export default wrappedInUserContext = withUserContext(Status);