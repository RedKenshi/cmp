import React from 'react';
import { Routes, Route } from "react-router-dom";

import { UserContext } from '../contexts/UserContext';

import Landing from './pages/signedout/Landing';
import Pricing from './pages/signedout/Pricing';
import HowItWorks from './pages/signedout/HowItWorks';
import AboutUs from './pages/signedout/AboutUs';

import Home from './pages/Home.jsx';
import Navbar from './navbar/Navbar';
import Login from './pages/Login.jsx';
import NeedActivation from './pages/NeedActivation.jsx';
import CustomPage from './pages/CustomPage.jsx';
import CrudEntityDetails from './pages/CrudEntityDetails';
import Pages from './pages/Pages.jsx';
import Structures from './pages/Structures.jsx';
import Structure from './pages/Structure.jsx';
import Statuses from './pages/Statuses.jsx';
import Status from './pages/Status.jsx';
import Accounts from './pages/Accounts.jsx';
import Demo from './pages/Demo.jsx';
import LayoutLab from './pages/LayoutLab';
import Palette from './pages/Palette';

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
            routes.push(
                <Route exact path={p.fullpath} key={p.fullpath} element={withNavbar(()=>
                    <CustomPage location={p.fullpath} />
                )({...props})}/>
            )
            if(p.layout == "crud"){
                routes.push(
                    <Route exact path={p.fullpath+"/:_id"} key={p.fullpath} element={withNavbar(()=>
                        <CrudEntityDetails layout={p.layout} layoutOptions={JSON.parse(p.layoutOptions)} _id={p._id} location={p.fullpath} />
                    )({...props})}/>
                )
                routes.push(
                    <Route exact path={p.fullpath+"/:_id/lab"} key={p.fullpath} element={withoutNavbar(()=>
                        <LayoutLab layout={p.layout} layoutOptions={JSON.parse(p.layoutOptions)} _id={p._id} location={p.fullpath} />
                    )({...props})}/>
                )
            }
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
                    <Route exact path="/" element={withNavbar(Home)({...props})} />
                    <Route exact path="/app" element={withNavbar(Home)({...props})}/>
                    <Route exact path="/home" element={<Landing />} />
                    <Route exact path="/pricing" element={<Pricing />} />
                    <Route exact path="/how-it-works" element={<HowItWorks />} />
                    <Route exact path="/about-us" element={<AboutUs />} />
                    {getRoutes()}
                    {(props.isAdmin ? <Route exact path="/admin" element={withNavbar(Pages)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/pages" element={withNavbar(Pages)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/structures" element={withNavbar(Structures)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/structures/:_id" element={withNavbar(Structure)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/status" element={withNavbar(Statuses)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/status/:_id" element={withNavbar(Status)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/accounts" element={withNavbar(Accounts)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/palette" element={withNavbar(Palette)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/demo" element={withNavbar(Demo)({...props})}/> : "")}
                    <Route path="*" element={withNavbar(Home)({...props})} />
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
                <Route exact path="/home" element={<Landing />} />
                <Route exact path="/pricing" element={<Pricing />} />
                <Route exact path="/how-it-works" element={<HowItWorks />} />
                <Route exact path="/about-us" element={<AboutUs />} />
                <Route exact path="/sign-in" element={<Login />} />
                <Route path="*" element={<Landing />} />
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