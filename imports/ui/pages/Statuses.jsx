import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import StatusRow from "../molecules/StatusRow";
import FontAwesomePicker from "../atoms/FontAwesomePicker";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Statuses = props => {

  const [statusFilter, setStatusFilter] = useState('');
  const [formValues, setFormValues] = useState({
        label:'',
        name:''
  });
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [statusesRaw, setStatusesRaw] = useState([]);

  const statusesQuery = gql` query statuses {
    statuses {
      _id
      entityUID
      values{
        _id
        label
      }
      label
    }
  }`;
  const addStatusQuery = gql`mutation addStatus($label: String){
    addStatus(label:$label){
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
  const handleFormChange = e => {
    setFormValues({
        ...formValues,
        [e.target.name] : e.target.value
    })
  }
  const addStatus = () => {
    props.client.mutate({
        mutation:addStatusQuery,
        variables:{
            label:formValues.label
        }
    }).then((data)=>{
        loadStatuses();
        closeModalAdd()
        props.toastQRM(data.data.addStatus)
    })
  }
  const deleteStatus = () => {
    props.client.mutate({
        mutation:deleteStatusQuery,
        variables:{
          _id:deleteTargetId
        }
    }).then((data)=>{
        loadStatuses();
        closeModalDelete()
        props.toastQRM(data.data.deleteStatus)
    })
  }
  const statuses = () => {
    return statusesRaw.filter(a=> a.label.toLowerCase().includes(statusFilter.toLowerCase()))
  }
  const handleFilter = value => {
    setStatusFilter(value);
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
  const addSubStatus = uid => {
    showModalAdd(uid);
  }
  const loadStatuses = () => {
    props.client.query({
      query:statusesQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setStatusesRaw(data.statuses);
    })
  }
  useEffect(() => {
    loadStatuses();
  })

  return (
    <Fragment>
      <div className="status padded columns">
        <div className="column is-narrow">
          <AdministrationMenu active="statuses"/>
        </div>
        <div className="column">
          <ul className="is-fullwidth">
            {statuses().map((s,i) => <StatusRow key={s._id} loadStatuses={loadStatuses} addSubStatus={addSubStatus} showModalDelete={showModalDelete} status={s} index={i}/>)}
          </ul>
        </div>
        <div className="column is-narrow">
          <div className="is-fullwidth box">
            <button className='button is-primary' onClick={()=>showModalAdd(0)}>
                <i className='fa-regular fa-plus'/>
            </button>
          </div>
        </div>
      </div>
      <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Créer un status</p>
                <button className="delete" aria-label="close" onClick={closeModalAdd}/>
            </header>
            <section className="modal-card-body">
            <div className="field">
                <label className="label">Label</label>
                <div className="control">
                  <input className="input" type="text" onChange={handleFormChange} name="label"/>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalAdd}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-primary" onClick={addStatus}>
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
    </Fragment>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Statuses);