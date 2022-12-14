import { padStart } from "lodash";
import React, { Fragment, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { gql } from 'graphql-tag';
import Button from "../elements/Button";

const PageRow = props => {

    //HOOK STATE
    const [displaySubs, setDisplaySubs] = useState(true);
    
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
                            <PageRowContext key={p._id} loadPages={props.loadPages} showModalAdd={props.showModalAdd} showModalDelete={props.showModalDelete} page={p} index={i}/>
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
    const getLayoutInfos = () => {
        return(
            <div class="tags has-addons">
                <span className={"tag is-dark"}>{props.layoutLabels.filter(x=>x.layout == props.page.layout)[0].label}</span>
                <span className={"tag is-primary"}>{props.layoutOptions.structureLabel}</span>
            </div>
        )
    }
    return (
        <Fragment>
            <li>
                <div className={"page-and-subs-wrapper" + (props.page.sub ? " has-subs" : " has-no-subs") }>
                    <div className="page-row-wrapper">
                        <div className="page-row-content">
                            {getDisplaySubsButton()}
                            <i className={(props.page.active ? "has-text-success " : "has-text-warning ") + "fa-duotone fa-file"}/>
                            <p>{props.page.title}</p>
                            {getLayoutInfos()}
                        </div>
                        <div className="page-row-actions">
                            <button onClick={()=>props.showModalAdd(props.page._id)} className="button is-small is-info">
                                <i className="fa-light fa-fw fa-plus"></i>
                            </button>
                            <button onClick={toggleActive} className={"button is-small" +(props.page.active ? " is-warning" : " is-success")}>
                                {(props.page.active ? <i className="fa-light fa-fw fa-cancel"></i> : <i className="fa-light fa-fw fa-check"></i>)}
                            </button>
                            <button onClick={()=>props.showModalDelete(props.page._id)} className="button is-small is-danger">
                                <i className="fa-light fa-fw fa-trash"></i>
                            </button>
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

export const PageRowContext = withUserContext(PageRow)
export default wrappedInUserContext = withUserContext(PageRow);
