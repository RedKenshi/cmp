import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FAFree } from '../elements/FAFree';

export const NavbarItemList = props => {
  const navigate = useNavigate()
  const { menuItems } = props;
  const list = [];
  menuItems.forEach(item => {
    if(item.display){
      list.push(
        <li className="nav-item" name={item.name} key={item.name}>
          <a className="nav-link" key={item.name} onClick={()=>{navigate(item.url)}} style={{textDecoration: 'none'}}>
            <i style={props.style} className={"fa fa-"+props.fastyle+" fa-"+ item.icon + " " + item.color}></i>
            <span className="link-text">{item.label}</span>
          </a>
        </li>
      )
    }
  });
  return (
    list
  );
}