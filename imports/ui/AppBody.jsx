import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import { UserContext } from '../contexts/UserContext';

import Home from './pages/Home.jsx';
import Navbar from './navbar/Navbar';
import Login from './pages/Login.jsx';
import NeedActivation from './pages/NeedActivation.jsx';
import CustomPage from './pages/CustomPage.jsx'
import Pages from './pages/Pages.jsx'
import Structures from './pages/Structures.jsx'
import Structure from './pages/Structure.jsx'
import Accounts from './pages/Accounts.jsx';

export const AppBody = props => {

    const getRoutes = () => {
        let routes = [];
        props.pagesTree.map(p=>{
            routes.push(...extractSubRoutes(p));
        })
        //console.log(routes.map(r=>r.props.path))// - UNCOMMENT TO CONSOLE LOG AVAILABLE ROUTES
        return routes;
    }
    const extractSubRoutes = p => {
        let routes = [];
        if(p.active){
            routes.push(<Route exact path={p.fullpath} element={withNavbar(CustomPage)({...props})}/>)
            if(p.sub){
                p.sub.map(s=>{routes.push(...extractSubRoutes(s));})
            }
        }
        return routes;
    }

    if(Meteor.userId() != null){
        if(props.isActivated == "loading"){
            return <p>loading ...</p>
        }
        if(props.isActivated){
            return (
                <Routes>
                    <Route path="/" element={withNavbar(Home)({...props})} />
                    <Route exact path="/home" element={withNavbar(Home)({...props})}/>
                    {getRoutes()}
                    {(props.isAdmin ? <Route exact path="/admin" element={withNavbar(Pages)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/pages" element={withNavbar(Pages)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/structures" element={withNavbar(Structures)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/structures/:uid" element={withNavbar(Structure)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/accounts" element={withNavbar(Accounts)({...props})}/> : "")}
                </Routes>
            )
        }else{
            return(
                <Routes>
                    <Route path="*" element={withNavbar(NeedActivation)({...props})} />
                </Routes>
            )
        }
    }else{
        return(
            <Routes>
                <Route path="*" element={<Login />} />
            </Routes>
        )
    }
}

const withNavbar = Component => props => (
    
    <div className="main-container-navbar">
        <Navbar />
        <div className="main-content">
            <Component {... props}/>
        </div>
    </div>
)
const withoutNavbar = Component => props => (
    <div className="main-container-fullscreen">
        <Component {... props}/>
    </div>
)

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(AppBody);