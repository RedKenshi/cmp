import React from "react";
import { UserContext } from '../../contexts/UserContext';
import AdministrationMenu from "../molecules/AdministrationMenu";

const Palette = props => {

    const colors = ["primary","info","link","danger","success","dark","warning"]

    return (
        <div className="page padded is-8 columns">
            <div className="column is-narrow">
                <AdministrationMenu active="palette"/>
            </div>
            <div className="column">
                <div className="flex flex-column" style={{gap:"1rem",width:"10rem",alignItems:"center"}}>
                    {colors.map(c=>{
                        return(
                            <button className={"button is-"+c}>{c}</button>
                        )
                    })}
                </div>
            </div>
            <div className="column">
                <div className="flex flex-column" style={{gap:"1rem",width:"10rem",alignItems:"center"}}>
                    {colors.map(c=>{
                        return(
                            <button className={"button is-light is-"+c}>{c}</button>
                        )
                    })}
                </div>
            </div>
            <div className="column">
                <div className="flex flex-column" style={{gap:"1rem",width:"10rem",alignItems:"center"}}>
                    {colors.map(c=>{
                        return(
                            <button className={"button is-outlined is-"+c}>{c}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
export default withUserContext(Palette);