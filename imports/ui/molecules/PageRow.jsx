import { padStart } from "lodash";
import React, { Fragment, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { gql } from 'graphql-tag';
import Button from "../elements/Button";

export const PageRow = props => {

    //HOOK STATE
    const [displaySubs, setDisplaySubs] = useState(false);
    const [displayContextualMenu, setDisplayContextualMenu] = useState(false);

    //GRAPHQL QUERIES AND MUTATIONS
    const toggleActiveQuery = gql`mutation toggleActive($_id:String!){
        toggleActive(_id:$_id){
            status
            message
        }
    }`;

    //DATABASE READ AND WRITE
    const toggleActive = () => {
        props.client.mutate({
            mutation:toggleActiveQuery,
            variables:{
                _id:props.page._id,
            }
        }).then((data)=>{
            props.loadPages();
            props.toastQRM(data.data.toggleActive)
            props.loadPages();
        })
    }

    //CONTENT GETTER
    const getSubPages = () => {
        if(displaySubs && props.page.sub != undefined){
            return(
                <ul className="subs is-fullwidth">
                    {
                        props.page.sub.map((p,i) =>
                            <PageRow key={p._id} loadPages={props.loadPages} addSubPage={props.addSubPage} showModalDelete={props.showModalDelete} page={p} index={i}/>
                        )
                    }
                </ul>
            )
        }else{
            return;
        }
    }
    const getDisplaySubsButton = () => {
        if(props.page.sub){
            return <i className={"fa-solid fa-caret-"+(displaySubs ? "down" : "right")}/>
        }else{
            return ""
        }
    }
    const getActiveIndicator = () => {
        if(props.page.active){
            return <span className="tag is-success">Active</span>
        }else{
            return <span className="tag is-danger">Inactive</span>
        }
    }

    return (
        <Fragment>
            <li>
                <div className={"page-and-subs-wrapper" + (props.page.sub ? " has-subs" : " has-no-subs") }>
                    <div className="page-row-wrapper" onClick={()=>setDisplaySubs(!displaySubs)}>
                        <div className="page-row-content">
                            {getDisplaySubsButton()}
                            <i className={"fa-"+props.fastyle+" fa-file"}/>
                            <p>{props.page.title}</p>
                        </div>
                        <div className="page-row-content">
                            {getActiveIndicator()}
                            <div className={"dropdown is-hoverable is-right " + (displayContextualMenu ? "is-active" : "")}>
                                <div className="dropdown-trigger">
                                    <i className="fa-solid fa-ellipsis" onClick={()=>setDisplayContextualMenu(!displayContextualMenu)}/>
                                </div>
                                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                    <div className="dropdown-content">
                                        <a onClick={()=>props.addSubPage(props.page.entityUID)} className="dropdown-item">
                                            Ajouter une sous page
                                        </a>
                                        <a onClick={toggleActive} className="dropdown-item">
                                            {(props.page.active ? "Désactiver la page" : "Activer la page")}
                                        </a>
                                        <a onClick={()=>props.showModalDelete(props.page._id)} className="dropdown-item">
                                            Supprimer la page
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {getSubPages()}
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
  
export default wrappedInUserContext = withUserContext(PageRow);
