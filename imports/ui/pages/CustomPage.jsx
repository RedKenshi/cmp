import React, { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import LayoutPicker from "../molecules/LayoutPicker";
import Crud from "./Crud";
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
      parentId
      title
      name
      url
      fullpath
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
        fullpath
        icon
        active
      }
    }
  }`;
  const parentsPageToTopQuery = gql` query parentsPageToTop($url: String!) {
    parentsPageToTop(url: $url) {
      _id
      parentId
      title
      url
      fullpath
    }
  }`;
  const setLayoutQuery = gql` mutation setLayout($_id: String!,$layout: String!,$layoutOptions:[String]) {
    setLayout(_id: $_id, layout: $layout, layoutOptions: $layoutOptions) {
      status
      message
    }
  }`;
  const loadPageAndSubs = () => {
    props.client.query({
      query:pageAndSubsQuery,
      fetchPolicy:"network-only",
      variables:{
        url:props.location
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
  const setLayout = (layout,layoutOptions) => {
    let input = layoutOptions.map(lo=>JSON.stringify(lo))
    console.log(input)
    props.client.mutate({
      mutation:setLayoutQuery,
      variables:{
        _id:pageRaw._id,
        layout:layout,
        layoutOptions:input
      }
    }).then((data)=>{
      props.toastQRM(data.data.setLayout)
      loadPageAndSubs();
    })
  }
  const getContent = () => {
    if(pageRaw.layout == null){
      return <LayoutPicker setLayout={setLayout}/>
    }else{
      if(pageRaw.layout == "crud"){
        return <Crud layoutOptions={pageRaw.layoutOptions} />
      }
    }
  }
  const getBreadcrumbs = () => {
    if(loadingBreadcrumbs){
      return <p>Loading breadcrumbs</p>
    }else{
      return (
        <nav className="breadcrumb padded-top16 padded-bottom16 padded-left16" aria-label="breadcrumbs">
          <ul>
            <li onClick={()=>navigate("/app")} style={{cursor:"pointer"}}><a>Home</a></li>
            {breadcrumbs.map(p=>{
              return(
                <li key={"bclocation" +p.fullpath} onClick={()=>navigate(p.fullpath)} style={{cursor:"pointer"}} className={p.fullpath == location.pathname ? "is-active" : ""} aria-current={p.fullpath == location.pathname ? "is-active" : ""}><a>{p.title}</a></li>
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
  },[])

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
                        <li key={sub._id}>
                          <a onClick={()=>navigate(sub.fullpath)} className={props.active == "pages" ? "is-active" : ""}>{sub.title}</a>
                      </li>
                      )
                    })}
                  </ul>
                </div>
            </div>
            <div className="column">
              {getContent()}
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