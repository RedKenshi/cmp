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
  const [currentParentId, setCurrentParentId] = useState("root");
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [pagesRaw, setPagesRaw] = useState([]);

  const pagesTreeQuery = gql` query pagesTree {
    pagesTree {
      _id
      parentId
      title
      name
      url
      icon
      active
      layout
      layoutOptions
      sub{
        _id
        parentId
        title
        name
        url
        icon
        active
        layout
        layoutOptions
        sub{
          _id
          parentId
          title
          name
          url
          icon
          active
          layout
          layoutOptions
          sub{
            _id
            parentId
            title
            name
            url
            icon
            active
            layout
            layoutOptions
          }
        }
      }
    }
  }`;
  const addPageQuery = gql`mutation addPage($title:String!,$icon:String!,$parentId:String!){
    addPage(title:$title,icon:$icon,parentId: $parentId){
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
            parentId:currentParentId
        }
    }).then((data)=>{
        loadPages();
        closeModalAdd()
        props.toastQRM(data.data.addPage)
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
  const showModalAdd = _id => {
    setCurrentParentId(_id);
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
  const loadPages = () => {
    props.client.query({
      query:pagesTreeQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setPagesRaw(data.pagesTree);
    })
  }
  const getPages = () => {
    if(pagesRaw.length > 0){
      return(
        <ul className="is-fullwidth box">
          {pagesRaw.filter(a=> a.title.toLowerCase().includes(pageFilter.toLowerCase())).map((p,i) => {
            return (<PageRow key={p._id} loadPages={loadPages} showModalAdd={showModalAdd} showModalDelete={showModalDelete} page={p} layoutOptions={props.parseLayoutOptions(p.layoutOptions)} index={i}/>)
          })}
        </ul>
      )
    }else{
      return(
        <div className="is-fullwidth box">
          No page created yet
        </div>
      )
    }
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
            {getPages()}
        </div>
        <div className="column is-narrow">
          <div className="is-fullwidth box">
            <button className='button is-primary' onClick={()=>showModalAdd('root')}>
                <i className='fa-regular fa-plus'/>
            </button>
          </div>
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
              {(currentParentId == "root" ?
                <div className="field">
                  <label className="label">Icon</label>
                  <div className="control">
                    <FontAwesomePicker selectIcon={selectIcon} />
                  </div>
                </div>
              : "")}
            </section>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalAdd}>
                    <span className="icon">
                      <i className='fa-light fa-arrow-left'/>
                    </span>
                    <span>Annuler</span>
                </button>
                <button className="button is-primary" onClick={addPage}>
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
                <p className="modal-card-title">Supprimer la page</p>
                <button className="delete" aria-label="close" onClick={closeModalDelete}/>
            </header>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalDelete}>
                    <span className="icon">
                      <i className='fa-light fa-arrow-left'/>
                    </span>
                    <span>Annuler</span>
                </button>
                <button className="button is-danger" onClick={deletePage}>
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

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Pages);