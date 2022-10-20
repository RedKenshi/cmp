


import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    const [tabsType,setTabsType] = useState("none");

    const [addingTab,setAddingTab] = useState(false);
    const [tabs,setTabs] = useState(["AAA"]);
    const [tabActive,setTabActive] = useState("AAA");
    const [structureRaw,setStructureRaw] = useState([]);
    const [structureLoaded,setStructureLoaded] = useState(false);
    const [rightShelfExpanded,setRightShelfExpanded] = useState(true);
    const [leftShelfExpanded,setLeftShelfExpanded] = useState(true);
    const [formValues, setFormValues] = useState({
        newtabname:''
    });

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
    const toggleAddingTab = () => {setAddingTab(!addingTab)}
    const handleChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }
    const handleTabsTypeChange = type => {
        if(tabsType == type){
            setTabsType("none")
        }else{
            setTabsType(type)
        }
    }
    const onDragEnd = () => {
        console.log("onDragEnd")
    }

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
    const addTab = () => {
        toggleAddingTab()
        setTabs([...tabs,formValues.newtabname])
    }

    //CONTENT GETTER
    const getRequiredFields = () => {
        if(structureLoaded){
            return (
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Required</h4>
                    <Droppable droppableId="required-data" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <div className="shelf-section-items-list" ref={provided.innerRef}>
                                {structureRaw.fields.filter(f=>f.requiredAtCreation).map((f,i)=>{
                                    return(
                                        <Draggable key={f._id} draggableId={f._id} index={i}>
                                            {(provided, snapshot) => (
                                                <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                    <div className="grabbable tags has-addons">
                                                        <span className="tag is-info">{f.label}</span>
                                                        <span className="tag is-dark">
                                                            <i className='fa-solid fa-bars'></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}
                    </Droppable>
                </div>
            )
        }
    }
    const getOptionalFields = () => {
        if(structureLoaded){
            return (
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Optional</h4>
                    <Droppable droppableId="optional-data" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <div className="shelf-section-items-list" ref={provided.innerRef}>
                                {structureRaw.fields.filter(f=>!f.requiredAtCreation).map((f,i)=>{
                                    return(
                                        <Draggable key={f._id} draggableId={f._id} index={i}>
                                            {(provided, snapshot) => (
                                                <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                    <div className="grabbable tags has-addons">
                                                        <span className="tag is-info">{f.label}</span>
                                                        <span className="tag is-dark">
                                                            <i className='fa-solid fa-bars'></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}
                    </Droppable>
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
                <button className="back-button button is-dark" onClick={()=>navigate(-1)}>
                    <span className="icon is-small">
                    <i className="fa-light fa-chevron-left"></i>
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
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Options</h4>
                </div>
                <div className="flex margined-left16">
                    <input onClick={()=>handleTabsTypeChange("side")} id="sideTabsSwitch" type="checkbox" name="switchExample" className="switch" checked={tabsType == "side" ? "checked" : ""} />
                    <label for="sideTabsSwitch">Tabs on side</label>
                </div>
                <div className="flex margined-left16">
                    <input onClick={()=>handleTabsTypeChange("top")} id="topTabsSwitch" type="checkbox" name="switchExample" className="switch" checked={tabsType == "top" ? "checked" : ""} />
                    <label for="topTabsSwitch">Tabs on top</label>
                </div>
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Disposition</h4>
                    <Droppable droppableId="layout-items" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <div className="shelf-section-items-list" ref={provided.innerRef}>
                                <Draggable draggableId="layout-5050" index={0}>
                                    {(provided, snapshot) => (
                                        <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                            <div className="grabbable tags has-addons">
                                                <span className="tag is-dark">
                                                    <i className='fa-solid fa-bars'></i>
                                                </span>
                                                <span className="tag is-info">50% / 50%</span>
                                            </div>
                                        </div>
                                        
                                    )}
                                </Draggable>
                                <Draggable draggableId="layout-3070" index={1}>
                                    {(provided, snapshot) => (
                                        <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                            <div className="grabbable tags has-addons">
                                                <span className="tag is-dark">
                                                    <i className='fa-solid fa-bars'></i>
                                                </span>
                                                <span className="tag is-info">30% / 70%</span>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Container</h4>
                    <Droppable droppableId="container-items" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <div className="shelf-section-items-list" ref={provided.innerRef}>
                                <Draggable draggableId="bold-title" index={0}>
                                    {(provided, snapshot) => (
                                        <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                            <div className="grabbable tags has-addons">
                                                <span className="tag is-dark">
                                                    <i className='fa-solid fa-bars'></i>
                                                </span>
                                                <span className="tag is-info">Bold title</span>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                                <Draggable draggableId="simple-box" index={1}>
                                    {(provided, snapshot) => (
                                        <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                            <div className="grabbable tags has-addons">
                                                <span className="tag is-dark">
                                                    <i className='fa-solid fa-bars'></i>
                                                </span>
                                                <span className="tag is-info">Simple Box</span>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        )
    }
    const getLabBody = () => {
        return(
            <div className={'lab-body ' + tabsType + "-tabs"}>
                {getTabs()}
                <div className='lab-content dropzone'>
                    Grab something and place it here
                </div>
            </div>
        )
    }
    const getTabs = () => {
        if(tabsType == "side"){
            return(
                <div className="subtabsbox box">
                    <ul className="menu-list">
                        {tabs.map(t=>{
                            return(
                                <li onClick={()=>setTabActive(t)}>
                                    <a className={tabActive == t ? "is-active" : ""}>{t}</a>
                                </li>
                            )
                        })}
                    </ul>
                    <input name="newtabname" onChange={handleChange} className={"input is-small tab-name" + (addingTab ? "" : " hidden")}></input>
                    {getAddTabControls()}
                </div>
            )
        }
        if(tabsType == "top"){
            return(
                <div className="tabs is-primary">
                    <ul>
                        {tabs.map(t=>{
                            return(
                                <li className={tabActive == t ? "is-active" : ""} onClick={()=>setTabActive(t)}>
                                    <a>{t}</a>
                                </li>
                            )
                        })}
                        <li className={"flex " + (tabsType == "side" ? " flex-column" : " nowrap" )}>
                            <input name="newtabname" onChange={handleChange} className={"newtabname input is-small tab-name" + (addingTab ? "" : " hidden")}></input>
                            {getAddTabControls()}
                        </li>    
                    </ul>
                </div>
                    
            )
        }
    }
    const getAddTabControls = () => {
        if(addingTab){
            return(
                <div className="flex nowrap">
                    <button className="button is-small is-danger is-light" onClick={toggleAddingTab}>
                        <span className="icon"><i className='fa-solid fa-xmark'/></span>
                    </button>
                    <button className="button is-small is-success is-light" onClick={addTab}>
                        <span className="icon"><i className='fa-solid fa-check'/></span>
                    </button>
                </div>
            )
        }else{
            return(
                <button className='add-tab button is-small is-light' onClick={toggleAddingTab}><i className='fa-solid fa-plus'/></button>
            )
        }
    }

    //COMPONENT LIFECYCLE
    useEffect(()=>{
        loadStructure();
    },[])

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={"lab" + (leftShelfExpanded ? " leftExpanded" : " leftCollapsed ") + (rightShelfExpanded ? " rightExpanded" : " rightCollapsed")}>
                {getLeftShelf()}
                {getRightShelf()}
                {getLabBody()}
            </div>
        </DragDropContext>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(LayoutLab);