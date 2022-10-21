


import React, { useState, useEffect, Fragment } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

export const LayoutLab = props => {
    
    //HOOKS
    const navigate = useNavigate();

    //BUSINESS MANIPULATION
    const newCell = (type,x,y,height,width) => {
        let cell = {
            type:type,
            content:[],
            uiid:uuid(),
            x:x,
            y:y,
            height:height,
            width:width
        };
        return cell;
    }
    const generateEmptyGrid = (height,width) => {
        let grid = [];
        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                row.push(newCell("placeholder",x,y,1,1))
            }
            grid[y] = row;
        }
        return grid
    }

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
    const [gridDimensionLocked,setGridDimensionLocked] = useState(false);
    const [tabsType,setTabsType] = useState("top");
    const [gridW,setGridW] = useState(3);
    const [gridH,setGridH] = useState(2);
    const [grid,setGrid] = useState(generateEmptyGrid(gridH,gridW))
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
    const remCol = () => {
        if(!gridDimensionLocked){
            if(gridW>1){
                setGridW(gridW-1)
                let clonedGrid = JSON.parse(JSON.stringify(grid));
                clonedGrid.forEach(row => row.splice(row.length-1,1));
                setGrid(clonedGrid)
            }else{
                props.toast({message:"At least 1 column is needed",type:"warning"})
            }
        }else{
            props.toast({message:"Grid dimensions are locked when it's not empty",type:"warning"})
        }
    }
    const addCol = () => {
        if(!gridDimensionLocked){
            if(gridW<12){
                setGridW(gridW+1)
                let clonedGrid = JSON.parse(JSON.stringify(grid));
                clonedGrid.forEach((row,i) => row.push(newCell("placeholder",gridW,i,1,1)));
                setGrid(clonedGrid)
            }else{
                props.toast({message:"A maxium of 12 column are available",type:"warning"})
            }
        }else{
            props.toast({message:"Grid dimensions are locked when it's not empty",type:"warning"})
        }
    }
    const remRow = () => {
        if(!gridDimensionLocked){
            if(gridH>1){
                setGridH(gridH-1)
                let clonedGrid = JSON.parse(JSON.stringify(grid));
                clonedGrid.splice(clonedGrid.length-1,1);
                setGrid(clonedGrid)
            }else{
                props.toast({message:"At least 1 row is needed",type:"warning"})
            }
        }else{
            props.toast({message:"Grid dimensions are locked when it's not empty",type:"warning"})
        }
    }
    const addRow = () => {
        if(!gridDimensionLocked){
            if(gridH<6){
                setGridH(gridH+1)
                let clonedGrid = JSON.parse(JSON.stringify(grid));
                let newRow = [];
                for (let i = 0; i < gridW; i++) {
                    newRow.push(newCell("placeholder",i,gridH,1,1))
                }
                console.log(newRow)
                clonedGrid.push(newRow);
                setGrid(clonedGrid)
            }else{
                props.toast({message:"A maximum of 6 row are available",type:"warning"})
            }
        }else{
            props.toast({message:"Grid dimensions are locked when it's not empty",type:"warning"})
        }
    }
    const placeInGrid = (item,coord) => {
        const y = coord.split("-")[coord.split("-").length-1]
        const x = coord.split("-")[coord.split("-").length-2]
        let clonedGrid = JSON.parse(JSON.stringify(grid));
        let cell = clonedGrid[x][y]
        cell.type = item;
        clonedGrid[x][y] = cell;
        setGrid(clonedGrid);
    }
    const onDragEnd = result => {
        const { source, destination, draggableId } = result;
        if (!destination) {return;}
        switch (source.droppableId) {
            case destination.droppableId:
                break;
            case 'required-data':
            case 'optional-data':
            case 'container-items':
            case 'layout-items':
                console.log(result)
                placeInGrid(draggableId,destination.droppableId)
                break;
            default:
                console.log("not implemented")
                break;
        }
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const copy = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const item = sourceClone[droppableSource.index];
        destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
        return destClone;
    };
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
        destClone.splice(droppableDestination.index, 0, removed);
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
        return result;
    };

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
                                                <Fragment>
                                                    <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                        <div className="grabbable tags has-addons">
                                                            <span className="tag is-info">{f.label}</span>
                                                            <span className="tag is-dark">
                                                                <i className='fa-solid fa-bars'></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {snapshot.isDragging && (
                                                        <div className="control">
                                                            <div className="grabbable tags has-addons">
                                                                <span className="tag is-info">{f.label}</span>
                                                                <span className="tag is-dark">
                                                                    <i className='fa-solid fa-bars'></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Fragment>
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
                                                <Fragment>
                                                    <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                        <div className="grabbable tags has-addons">
                                                            <span className="tag is-info">{f.label}</span>
                                                            <span className="tag is-dark">
                                                                <i className='fa-solid fa-bars'></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {snapshot.isDragging && (
                                                        <div className="control">
                                                            <div className="grabbable tags has-addons">
                                                                <span className="tag is-info">{f.label}</span>
                                                                <span className="tag is-dark">
                                                                    <i className='fa-solid fa-bars'></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Fragment>
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
                    <h4 className='shelf-section-title'>Grid {gridH}<span style={{textTransform:"lowerCase"}}>x</span>{gridW} </h4>
                    <div className='flex flex-column gap'>
                        <div className='flex center align gap'>
                            <span onClick={remCol} className='tag pointable is-outlined is-danger'>-</span>
                            <i style={{fontSize:"1.5rem"}} className='fa-solid fa-columns'/>
                            <span onClick={addCol} className='tag pointable is-outlined is-success'>+</span>
                        </div>
                        <div className='flex center align gap'>
                            <span onClick={remRow} className='tag pointable is-outlined is-danger'>-</span>
                            <i style={{fontSize:"1.5rem"}} className='fa-solid fa-rows'/>
                            <span onClick={addRow} className='tag pointable is-outlined is-success'>+</span>
                        </div>
                    </div>
                </div>
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Container</h4>
                    <Droppable droppableId="container-items" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <div className="shelf-section-items-list" ref={provided.innerRef}>
                                <Draggable draggableId="bold-title" index={0}>
                                    {(provided, snapshot) => (
                                        <Fragment>
                                            <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                <div className="grabbable tags has-addons">
                                                    <span className="tag is-dark">
                                                        <i className='fa-solid fa-heading'></i>
                                                    </span>
                                                    <span className="tag is-info">Bold title</span>
                                                </div>
                                            </div>
                                            {snapshot.isDragging && (
                                                <div className="control">
                                                    <div className="grabbable tags has-addons">
                                                        <span className="tag is-dark">
                                                            <i className='fa-solid fa-heading'></i>
                                                        </span>
                                                        <span className="tag is-info">Bold title</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Fragment>
                                    )}
                                </Draggable>
                                <Draggable draggableId="simplebox" index={1}>
                                    {(provided, snapshot) => (
                                        <Fragment>
                                            <div className="control" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                                                <div className="grabbable tags has-addons">
                                                    <span className="tag is-dark">
                                                        <i className='fa-light fa-square'></i>
                                                    </span>
                                                    <span className="tag is-info">Simple Box</span>
                                                </div>
                                            </div>
                                            {snapshot.isDragging && (
                                                <div className="control">
                                                    <div className="grabbable tags has-addons">
                                                        <span className="tag is-dark">
                                                            <i className='fa-light fa-square'></i>
                                                        </span>
                                                        <span className="tag is-info">Simple Box</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Fragment>
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
                <div className='lab-content dropzone rows'>
                    {getGrid()}
                </div>
            </div>
        )
    }
    const getGrid = () => {
        return (
            <Fragment>
                {grid.map((r,i) => {
                    return (
                        <div className="row columns" key={i}>
                            {r.map((c,j) =>
                                <div key={j} className='column'>
                                    {getCellContent(c,i,j)}
                                </div>
                            )}
                        </div>
                    )
                })}
            </Fragment>
        )
    }
    const getCellContent = (c,i,y) => {
        switch(c.type){
            case "placeholder" :
                return(
                    <Droppable droppableId={c.type+"-"+i+"-"+y} isDropDisabled={false}>
                        {(provided, snapshot) => {
                            return(
                                <div className='placeholder-square' ref={provided.innerRef}>
                                    placeholder
                                </div>
                            )
                        }}
                    </Droppable>
                )
                break;
            case "simplebox" :
                return(
                    <Droppable droppableId={c.type+"-"+i+"-"+y} isDropDisabled={false}>
                        {(provided, snapshot) => {
                            return(
                                <div className='box' ref={provided.innerRef}>
                                    Box
                                </div>
                            )
                        }}
                    </Droppable>
                )
                break;
        }
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