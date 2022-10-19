


import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

export const LayoutLab = props => {
    
    //HOOKS
    const navigate = useNavigate();

    //STATES
    const fieldTypes = [
        {
            typeName:"required",
            color:"primary",
            icon:"circle-exclamation",
            label:"Champs requis"
        },
        {
            typeName:"optional",
            color:"link",
            icon:"brackets-curly",
            label:"Champs optionnels"
        }
    ]
    const [tabsSwitch,setTabsSwitch] = useState(false);
    const [tabActive,setTabActive] = useState("AAA");
    const [structureRaw,setStructureRaw] = useState([]);
    const [structureLoaded,setStructureLoaded] = useState(false);
    const [rightShelfExpanded,setRightShelfExpanded] = useState(true);
    const [leftShelfExpanded,setLeftShelfExpanded] = useState(true);

    //GQL QUERIES
    const structureQuery = gql` query structure($_id: String!) {
        structure(_id:$_id) {
            _id
            icon
            fields{
                _id
                label
                name
                type
                requiredAtCreation
            }
            label
            name
        }
    }`;

    //CONTROLS
    const toggleTabs = () => {setTabsSwitch(!tabsSwitch)}

    //DB READ AND WRITE
    const loadStructure = () => {
        props.client.query({
            query:structureQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:props.layoutOptions.structureId,
            }
        }).then(({data})=>{
            setStructureRaw(data.structure);
            setStructureLoaded(true)
        })
    }

    //CONTENT GETTER
    const getRequiredFields = () => {
        if(structureLoaded){
            return (
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Required</h4>
                    {structureRaw.fields.filter(f=>f.requiredAtCreation).map(f=>
                        <div class="control">
                            <div class="grabbable tags has-addons">
                                <span class="tag is-dark">
                                    <i className='fa-solid fa-bars'></i>
                                </span>
                                <span class="tag is-success">{f.label}</span>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
    const getOptionalFields = () => {
        if(structureLoaded){
            return (
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Optional</h4>
                    {structureRaw.fields.filter(f=>!f.requiredAtCreation).map(f=>
                        <div class="control">
                            <div class="grabbable tags has-addons">
                                <span class="tag is-dark">
                                    <i className='fa-solid fa-bars'></i>
                                </span>
                                <span class="tag is-success">{f.label}</span>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
    const getLeftShelf = () => {
        return(
            <div className={'leftShelf shelf' + (leftShelfExpanded ? " expanded" : " collapsed ")}>
                <button className="button collapse-control is-small is-round is-dark" onClick={()=>setLeftShelfExpanded(!leftShelfExpanded)}>
                    <i className={'fa-light ' + (leftShelfExpanded ? "fa-chevron-left" : "fa-chevron-right")}/>
                </button>
                <h3 className='shelf-title'>Data</h3>
                <div className='available-data'>
                    {getRequiredFields()}
                    {getOptionalFields()}
                </div>
                <button class="back-button button is-dark" onClick={()=>navigate(-1)}>
                    <span class="icon is-small">
                    <i class="fa-light fa-chevron-left"></i>
                    </span>
                    <span>Go back</span>
                </button>
            </div>
        )
    }
    const getRightShelf = () => {
        return(
            <div className={'rightShelf shelf' + (rightShelfExpanded ? " expanded" : " collapsed")}>
                <button className="button collapse-control is-small is-round is-dark" onClick={()=>setRightShelfExpanded(!rightShelfExpanded)}>
                    <i className={'fa-light ' + (rightShelfExpanded ? "fa-chevron-right" : "fa-chevron-left")}/>
                </button>
                <h3 className='shelf-title'>Layout</h3>
                <div class="flex center">
                    <input onClick={toggleTabs} id="tabsSwitch" type="checkbox" name="switchExample" class="switch" checked={tabsSwitch ? "checked" : ""} />
                    <label for="tabsSwitch">Tabs</label>
                </div>
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'></h4>
                    <button className='button is-dark is-small'>Hey</button>
                    <button className='button is-dark is-small'>Hey</button>
                </div>
            </div>
        )
    }
    const getLabBody = () => {
        return(
            <div className={'lab-body' + (tabsSwitch ? " subtabs" : " notabs")}>
                {getTabs()}
                <div className='lab-content empty'>
                    Grab something and place it here
                </div>
            </div>
        )
    }
    const getTabs = () => {
        if(tabsSwitch){
            return(
                <div className="subtabsbox box">
                    <ul className="menu-list">
                        <li onClick={()=>setTabActive("AAA")}>
                            <a className={tabActive == "AAA" ? "is-active" : ""}>AAA</a>
                        </li>
                    </ul>
                    <button className='add-tab button is-small is-light'><i className='fa-solid fa-plus'/></button>
                </div>
            )
        }
    }

    //COMPONENT LIFECYCLE
    useEffect(()=>{
        loadStructure();
    },[])

    return(
        <div className={"lab" + (leftShelfExpanded ? " leftExpanded" : " leftCollapsed ") + (rightShelfExpanded ? " rightExpanded" : " rightCollapsed")}>
            {getLeftShelf()}
            {getRightShelf()}
            {getLabBody()}
        </div>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(LayoutLab);