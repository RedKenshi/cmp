/*BASICS*/
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
/*CONTEXT*/
import { UserContext } from '../../contexts/UserContext';
/*ELEMENTS*/
import { DuoIcon } from '../elements/DuoIcon';
/*COMPONENTS*/
import { NavbarItemList } from './NavbarItemList';

export const Navbar = props => {
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

  return (
    <Fragment>
      <div className="navbar">
        <ul className="navbar-nav">
          <li className="logo" >
            <a className="nav-link nav-link-logo" key={"logout"}>
              <span className="link-text">CMP</span>
              <DuoIcon name="double-chevron-right" color="blue"/>
            </a>
          </li>
          <hr/>
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigate("/")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-home dark"}></i>
              <span className="link-text">Home</span>
            </a>
          </li>
          <hr/>
          <NavbarItemList warnContext={props.warnContext} fastyle={props.fastyle} menuItems={getMenuItemsList()}/>
          <hr/>
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