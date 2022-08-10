import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import LayoutPicker from "../molecules/LayoutPicker";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const CustomPage = props => {

  const [pagesRaw,setPagesRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageAndSubTreeQuery = gql` query pageAndSubTree {
    pageAndSubTree {
      _id
      entityUID
      parentUID
      title
      name
      url
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

  const handleFormChange = e => {
    setFormValues({
        ...formValues,
        [e.target.name] : e.target.value
    })
  }
  const handleFilter = value => {
    setPageFilter(value);
  }
  const loadPageAndSubTree = () => {
    props.client.query({
      query:pageAndSubTreeQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setPagesRaw(data.pageAndSubTree);
      setLoading(false)
    })
  }
  const setLayout = layout => {
    console.log(layout)
    return layout;
  }
  const getContent = () => {
    if(pagesRaw.layout == null){
      return <LayoutPicker setLayout={setLayout}/>
    }
    return "THIS IS PICKED LAYOUT";
  }
  useEffect(() => {
    loadPageAndSubTree();
  })

  if(loading){
    return("loading...")
  }else{
    return(
      <Fragment>
        <div className="page padded columns">
          <div className="column is-narrow">
              <div className="box">
                  <ul className="menu-list">
                      <li>
                          <a className={props.active == "pages" ? "is-active" : ""}>
                          A
                          </a>
                      </li>
                      <li>
                          <a className={props.active == "objects" ? "is-active" : ""}>
                          B
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="column">
            <ul className="is-fullwidth">
              {getContent()}
            </ul>
          </div>
          <div className="column is-narrow">
            <button className='button is-light is-info' onClick={()=>showModalAdd(0)}>
                <i className='fa-regular fa-plus'/>
            </button>
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