import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import StructureRow from "../molecules/StructureRow";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Structures = props => {

  const [structureFilter, setStructureFilter] = useState('');
  const [formValues, setFormValues] = useState({
        label:'',
        name:''
  });
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [structuresRaw, setStructuresRaw] = useState([]);

  const structuresQuery = gql` query structures {
    structures {
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
  const addStructureQuery = gql`mutation addStructure($label: String, $name: String){
    addStructure(label:$label,name:$name){
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
  const handleFormChange = e => {
    setFormValues({
        ...formValues,
        [e.target.name] : e.target.value
    })
  }
  const addStructure = () => {
    props.client.mutate({
        mutation:addStructureQuery,
        variables:{
            label:formValues.label,
            name:formValues.name
        }
    }).then((data)=>{
        loadStructures();
        closeModalAdd()
        props.toastQRM(data.data.addStructure)
    })
  }
  const deleteStructure = () => {
    props.client.mutate({
        mutation:deleteStructureQuery,
        variables:{
          _id:deleteTargetId
        }
    }).then((data)=>{
        loadStructures();
        closeModalDelete()
        props.toastQRM(data.data.deleteStructure)
    })
  }
  const structures = () => {
    return structuresRaw.filter(a=> a.label.toLowerCase().includes(structureFilter.toLowerCase()))
  }
  const handleFilter = value => {
    setStructureFilter(value);
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
  const addSubStructure = uid => {
    showModalAdd(uid);
  }
  const loadStructures = () => {
    props.client.query({
      query:structuresQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setStructuresRaw(data.structures);
    })
  }
  const getStructures = () => {
    if(structuresRaw.length > 0){
      return(
        <ul className="is-fullwidth">
          {structuresRaw.filter(a=> a.label.toLowerCase().includes(structureFilter.toLowerCase())).map((s,i) => <StructureRow key={s._id} loadStructures={loadStructures} showModalDelete={showModalDelete} index={i} structure={s}/>)}
        </ul>
      )
    }else{
      return(
        <div className="is-fullwidth box">
          No structure created yet
        </div>
      )
    }
  }
  useEffect(() => {
    loadStructures();
  })

  return (
    <Fragment>
      <div className="structure padded columns">
        <div className="column is-narrow">
          <AdministrationMenu active="structures"/>
        </div>
        <div className="column">
          <ul className="is-fullwidth">
            {getStructures()}
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
                <p className="modal-card-title">Créer une structure</p>
                <button className="delete" aria-label="close" onClick={closeModalAdd}/>
            </header>
            <section className="modal-card-body">
            <div className="field">
                <label className="label">Label</label>
                <div className="control">
                  <input className="input" type="text" onChange={handleFormChange} name="label"/>
                </div>
              </div>
              <div className="field">
                <label className="label">Nom</label>
                <div className="control">
                  <input className="input" type="text" onChange={handleFormChange} name="name"/>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalAdd}>
                    <span className="icon">
                      <i className='fa-light fa-arrow-left'/>
                    </span>
                    <span>Annuler</span>
                </button>
                <button className="button is-primary" onClick={addStructure}>
                    <span>Créer</span>
                    <span className="icon">
                      <i className='fa-light fa-check'/>
                    </span>
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

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Structures);