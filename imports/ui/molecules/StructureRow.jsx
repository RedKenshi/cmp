import React, { Fragment, useState, useNa } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext";
import { gql } from 'graphql-tag';

export const StructureRow = props => {

    //HOOK STATE
    const navigate = useNavigate();

    //GRAPHQL QUERIES AND MUTATIONS

    //CONTENT GETTER

    return (
        <Fragment>
            <li>
                <div className="structure-row-wrapper">
                    <div className="columns">
                        <div className="is-narrow column flex align">
                            <i className={"fa fa-"+props.fastyle+" fa-cube"}/>
                        </div>
                        <div className="column flex align">
                            <h3>{props.structure.label}</h3>
                        </div>
                    </div>
                    <div className="details-and-actions columns">
                        <div className="details column is-half">
                            <i className="tag is-medium is-info">xxx instances</i>
                        </div>
                        <div className="actions column is-half">
                            <button className="button is-small is-danger" onClick={()=>props.showModalDelete(props.structure._id)}>Delete</button>
                            <button className="button is-small is-info" onClick={()=>navigate(props.structure.entityUID.toString())} >Details</button>
                        </div>
                    </div>
                </div>
            </li>
        </Fragment>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(StructureRow);
