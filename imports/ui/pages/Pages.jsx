import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import PageRow from "../molecules/PageRow";
import FontAwesomePicker from "../atoms/FontAwesomePicker";
import AdministrationMenu from "../molecules/AdministrationMenu";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Pages = props => {

  const [pageFilter, setPageFilter] = useState('');
  const [formValues, setFormValues] = useState({
        title:'',
        icon:''
  });
  const [currentParentUID, setCurrentParentUID] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [pagesRaw, setPagesRaw] = useState([]);

  const pagesTreeQuery = gql` query pagesTree {
    pagesTree {
      _id
      entityUID
      parentUID
      title
      name
      url
      icon
      active
      sub{
        _id
        entityUID
        parentUID
        title
        name
        url
        icon
        active
        sub{
          _id
          entityUID
          parentUID
          title
          name
          url
          icon
          active
          sub{
            _id
            entityUID
            parentUID
            title
            name
            url
            icon
            active
          }
        }
      }
    }
  }`;
  const addPageQuery = gql`mutation addPage($title:String!,$icon:String!,$parentUID:Int!){
    addPage(title:$title,icon:$icon,parentUID: $parentUID){
        status
        message
    }
  }`;
  const deletePageQuery = gql`mutation deletePage($_id:String!){
    deletePage(_id:$_id){
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
  const selectIcon = icon => {
    setFormValues({
      ...formValues,
      icon : icon
    })
  }
  const addPage = () => {
    props.client.mutate({
        mutation:addPageQuery,
        variables:{
            title:formValues.title,
            icon:formValues.icon,
            parentUID:currentParentUID
        }
    }).then((data)=>{
        loadPages();
        closeModalAdd()
        props.toastQRM(data.data.addPage)
        props.loadPages();
    })
  }
  const deletePage = () => {
    props.client.mutate({
        mutation:deletePageQuery,
        variables:{
          _id:deleteTargetId
        }
    }).then((data)=>{
        loadPages();
        closeModalDelete()
        props.toastQRM(data.data.deletePage)
        props.loadPages();
    })
  }
  const pages = () => {
    return pagesRaw.filter(a=> a.title.toLowerCase().includes(pageFilter.toLowerCase()))
  }
  const handleFilter = value => {
    setPageFilter(value);
  }
  const showModalAdd = uid => {
    setCurrentParentUID(uid);
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
  const addSubPage = uid => {
    showModalAdd(uid);
  }
  const loadPages = () => {
    props.client.query({
      query:pagesTreeQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setPagesRaw(data.pagesTree);
    })
  }
  useEffect(() => {
    loadPages();
  })

  return (
    <Fragment>
      <div className="page padded columns">
        <div className="column is-narrow">
          <AdministrationMenu active="pages"/>
        </div>
        <div className="column">
          <ul className="is-fullwidth box">
            {pages().map((p,i) => <PageRow key={p._id} loadPages={loadPages} addSubPage={addSubPage} showModalDelete={showModalDelete} page={p} index={i}/>)}
          </ul>
        </div>
        <div className="column is-narrow">
          <button className='button is-light is-info' onClick={()=>showModalAdd(0)}>
              <i className='fa-regular fa-plus'/>
          </button>
        </div>
      </div>
      <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Ajouter une page</p>
                <button className="delete" aria-label="close" onClick={closeModalAdd}/>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input className="input" type="text" onChange={handleFormChange} name="title"/>
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
                <button className="button is-primary" onClick={addPage}>
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
                <p className="modal-card-title">Supprimer la page</p>
                <button className="delete" aria-label="close" onClick={closeModalDelete}/>
            </header>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalDelete}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-danger" onClick={deletePage}>
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

export default wrappedInUserContext = withUserContext(Pages);