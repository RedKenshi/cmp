import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import StructureRow from "../molecules/StructureRow";
import FontAwesomePicker from "../atoms/FontAwesomePicker";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Structures = props => {

  const [structureFilter, setStructureFilter] = useState('');
  const [formValues, setFormValues] = useState({
        label:'',
        name:'',
        icon:''
  });
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [structuresRaw, setStructuresRaw] = useState([]);

  const structuresQuery = gql` query structures {
    structures {
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
  const addStructureQuery = gql`mutation addStructure($label: String, $name: String, $icon: String){
    addStructure(label:$label,name:$name,icon:$icon){
        status
        message
    }
  }`;
  const addFieldToStructureQuery = gql`mutation addFieldToStructure($_id: String!,$label: String, $name: String, $type: String!){
    addFieldToStructure(label:$label,name:$name){
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

const selectIcon = icon => {
  setFormValues({
    ...formValues,
    icon : icon
  })
}
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
            name:formValues.name,
            icon:formValues.icon
        }
    }).then((data)=>{
        loadStructures();
        closeModalAdd()
        props.toastQRM(data.data.addStructure)
        props.loadStructures();
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
        props.loadStructures();
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
            {structures().map((s,i) => <StructureRow key={s._id} loadStructures={loadStructures} addSubStructure={addSubStructure} showModalDelete={showModalDelete} structure={s} index={i}/>)}
          </ul>
        </div>
        <div className="column is-narrow">
          <div className="is-fullwidth box">
            <button className='button is-light is-link' onClick={()=>showModalAdd(0)}>
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
              <div className="field">
                  <label className="label">Icon</label>
                  <div className="control">
                    <FontAwesomePicker selectIcon={selectIcon} />
                  </div>
                </div>
            </section>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalAdd}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-primary" onClick={addStructure}>
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

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Structures);