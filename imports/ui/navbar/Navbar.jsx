/*BASICS*/
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
/*CONTEXT*/
import { UserContext } from '../../contexts/UserContext';
/*ELEMENTS*/
import { DuoIcon } from '../elements/DuoIcon';
/*COMPONENTS*/

export const Navbar = props => {
  const [expanded,setExpanded] = useState(false)
  const navigate = useNavigate();
  const logout = () => {
    props.logout();
    navigate("/")
  }
  const navigateTo = url => {
    navigate(url)
    setExpanded(false)
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
              <i className={"fa-"+props.fastylenav+" fa-chevrons-right"} color="blue"/>
            </a>
          </li>
          <li className="nav-item nav-expand" name={"expand"}>
            <a className="nav-link" onClick={()=>expand(true)}>
              <i className={"fa fa-"+props.fastylenav+" fa-bars dark"}></i>
            </a>
          </li>
          <li className="nav-item nav-collapse" name={"collapse"}>
            <a className="nav-link" onClick={()=>expand(false)}>
              <i className={"fa fa-"+props.fastylenav+" fa-xmark dark"}></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-home hide">
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigateTo("/app")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastylenav+" fa-home dark"}></i>
              <span className="link-text">Home</span>
            </a>
          </li>
          <hr/>
          {getMenuItemsList().map((item,i) => {
            if(item.display){
              return(
                <li className="nav-item" name={item.name} key={item.name+"-"+i}>
                  <a className="nav-link" key={item.name} onClick={()=>{navigate(item.url)}} style={{textDecoration: 'none'}}>
                    <i style={props.style} className={"fa fa-"+props.fastylenav+" fa-"+ item.icon + " " + item.color}></i>
                    <span className="link-text">{item.label}</span>
                  </a>
                </li>
              )
            }
          })}
          <hr/>
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigateTo("/admin/pages")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastylenav+" fa-cogs dark"}></i>
              <span className="link-text">Settings</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigateTo("/admin/accounts")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastylenav+" fa-shield-alt dark"}></i>
              <span className="link-text">Administrattion</span>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-logout hide">
          <li className="nav-item" name={"logout"}>
            <a href="#" className="nav-link" key={"logout"} onClick={()=>logout()}>
              <i className={"fa fa-"+props.fastylenav+" fa-power-off red"}></i>
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