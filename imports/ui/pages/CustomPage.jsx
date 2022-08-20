import React, { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import LayoutPicker from "../molecules/LayoutPicker";
import _ from 'lodash';

const CustomPage = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageRaw,setPageRaw] = useState([]);
  const [breadcrumbs,setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBreadcrumbs, setLoadingBreadcrumbs] = useState(true);

  const pageAndSubsQuery = gql` query pageAndSubs($url: String!) {
    pageAndSubs(url: $url) {
      _id
      entityUID
      parentUID
      title
      name
      url
      fullpath
      icon
      active
      layout{
        _id
        name
      }
      sub{
        _id
        entityUID
        parentUID
        title
        name
        url
        fullpath
        icon
        active
      }
    }
  }`;
  const parentsPageToTopQuery = gql` query parentsPageToTop($url: String!) {
    parentsPageToTop(url: $url) {
      _id
      entityUID
      parentUID
      title
      url
      fullpath
    }
  }`;

  const handleFormChange = e => {
    setFormValues({
        ...formValues,
        [e.target.name] : e.target.value
    })
  }
  const loadPageAndSubs = () => {
    props.client.query({
      query:pageAndSubsQuery,
      fetchPolicy:"network-only",
      variables:{
        url:location.pathname
      }
    }).then(({data})=>{
      setPageRaw(data.pageAndSubs);
      setLoading(false)
    })
  }
  const loadBreadcrumbs = () => {
    props.client.query({
      query:parentsPageToTopQuery,
      fetchPolicy:"network-only",
      variables:{
        url:location.pathname
      }
    }).then(({data})=>{
      setBreadcrumbs(data.parentsPageToTop);
      setLoadingBreadcrumbs(false)
    })
  }
  const setLayout = layout => {
    console.log(layout)
    return layout;
  }
  const getContent = () => {
    if(pageRaw.layout == null){
      return <LayoutPicker setLayout={setLayout}/>
    }
    return "THIS IS PICKED LAYOUT";
  }
  const getBreadcrumbs = () => {
    if(loadingBreadcrumbs){
      return <p>Loading breadcrumbs</p>
    }else{
      return (
        <nav className="breadcrumb padded-top16 padded-left16" aria-label="breadcrumbs">
          <ul>
            <li onClick={()=>navigate("/")} style={{cursor:"pointer"}}><a>Home</a></li>
            {breadcrumbs.map(p=>{
              return(
                <li onClick={()=>navigate(p.fullpath)} style={{cursor:"pointer"}} className={p.fullpath == location.pathname ? "is-active" : ""} aria-current={p.fullpath == location.pathname ? "is-active" : ""}><a>{p.title}</a></li>
              )
            })}
          </ul>
        </nav>
      );
    }
  }
  useEffect(() => {
    loadBreadcrumbs()
    loadPageAndSubs();
  })

  if(loading){
    return("loading...")
  }else{
    return(
      <Fragment>
        <div className="page padded-left16 padded-right16">
          <div className="columns">
            <div className="is-fullwidth"></div>
              {getBreadcrumbs()}
            </div>
            <div className="columns">
            <div className="column is-narrow">
                <div className="box">
                  <p className="menu-label">Sous-pages</p>
                  <ul className="menu-list">
                    {pageRaw.sub.map(sub=>{
                      return(
                        <li>
                          <a onClick={()=>navigate(sub.fullpath)} className={props.active == "pages" ? "is-active" : ""}>{sub.title}</a>
                      </li>
                      )
                    })}
                  </ul>
                </div>
            </div>
            <div className="column">
              <ul className="is-fullwidth">
                <div className="box">
                  <article class="message is-link">
                    <div class="message-header">
                      <p>Aucun type de page affecté</p>
                    </div>
                    <div class="message-body">
                      Aucun type n'est affecté à cette page.
                      Le type d'une page sert à détérminer la fonction de la page ainsi que l'interface qui sera utilisé dessus. 
                      Sélectionnez un type de page pour commencer à utiliser cette page.
                    </div>
                  </article>
                  {getContent()}
                </div>                
              </ul>
            </div>
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

export default wrappedInUserContext = withUserContext(CustomPage);