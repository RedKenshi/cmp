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
                <div className="structure-row-wrapper box">
                    <div className="columns">
                        <div className="column flex align">
                            <h3>{props.structure.label}</h3>
                        </div>
                    </div>
                    <div className="details-and-actions columns">
                        <div className="details column is-justify-content-space-between">
                            <i className="tag is-small is-link is-light">0 instances</i>
                            <div className="actions column is-half">
                                <button className="button is-small is-danger is-light" onClick={()=>props.showModalDelete(props.structure._id)}>
                                    <i className={"fa-" + props.fastyle + " fa-trash"}></i>
                                </button>
                                <button className="button is-small is-link is-light" onClick={()=>navigate(props.structure.entityUID.toString())} >
                                    <i className={"fa-" + props.fastyle + " fa-magnifying-glass"}></i>
                                </button>
                            </div>
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
