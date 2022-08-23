/*BASICS*/
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
/*CONTEXT*/
import { UserContext } from '../../contexts/UserContext';
/*ELEMENTS*/
import { DuoIcon } from '../elements/DuoIcon';
/*COMPONENTS*/
import { NavbarItemList } from './NavbarItemList';

export const Navbar = props => {
  const [expanded,setExpanded] = useState(false)
  const navigate = useNavigate();
  const logout = () => {
    props.logout();
    navigate("/")
  }
  const getMenuItemsList = () =>{
    return (
      props.pagesTree.map(page=>{
        return({
          url:page.url,
          active:page.name,
          label:page.title,
          display:page.active,
          icon:page.icon,
          color:"dark"
        })
      })
    );
  }
  const expand = bool => {
    setExpanded(bool)
  }

  return (
    <Fragment>
      <div className={"navbar " + (expanded ? "expanded" : "")}>
        <ul className="navbar-nav navbar-logo">
          <li className="logo">
            <a className="nav-link nav-link-logo" key={"logout"}>
              <span className="link-text">CMP</span>
              <i className={"fa-" + props.fastyle + " fa-chevrons-right"} color="blue"/>
            </a>
          </li>
          <li className="nav-item nav-expand" name={"expand"}>
            <a className="nav-link" onClick={()=>expand(true)}>
              <i className={"fa fa-"+props.fastyle+" fa-bars dark"}></i>
            </a>
          </li>
          <li className="nav-item nav-collapse" name={"collapse"}>
            <a className="nav-link" onClick={()=>expand(false)}>
              <i className={"fa fa-"+props.fastyle+" fa-xmark dark"}></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-home hide">
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigate("/")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-home dark"}></i>
              <span className="link-text">Home</span>
            </a>
          </li>
        </ul>
        <hr/>
        <ul className="navbar-nav navbar-pages hide">
          <NavbarItemList fastyle={props.fastyle} menuItems={getMenuItemsList()}/>
        </ul>
        <hr/>
        <ul className="navbar-nav navbar-admin hide">
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigate("/admin/pages")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-cogs dark"}></i>
              <span className="link-text">Settings</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigate("/admin/accounts")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-shield-alt dark"}></i>
              <span className="link-text">Administrattion</span>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-logout hide">
          <li className="nav-item" name={"logout"}>
            <a href="#" className="nav-link" key={"logout"} onClick={()=>logout()}>
              <i className={"fa fa-"+props.fastyle+" fa-power-off red"}></i>
              <span className="link-text">SE DÉCONNECTER</span>
            </a>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Navbar);