


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
                    {structureRaw.fields.filter(f=>f.requiredAtCreation).map(f=><i className='tag is-primary'>{f.label}</i>)}
                </div>
            )
        }
    }
    const getOptionalFields = () => {
        if(structureLoaded){
            return (
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'>Optional</h4>
                    {structureRaw.fields.filter(f=>!f.requiredAtCreation).map(f=><i className='tag is-secondary'>{f.label}</i>)}
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
                {getRequiredFields()}
                {getOptionalFields()}
            </div>
        )
    }
    const getRightShelf = () => {
        return(
            <div className={'rightShelf shelf' + (rightShelfExpanded ? " expanded" : " collapsed")}>
                <button className="button collapse-control is-small is-round is-dark" onClick={()=>setRightShelfExpanded(!rightShelfExpanded)}>
                    <i className={'fa-light ' + (rightShelfExpanded ? "fa-chevron-right" : "fa-chevron-left")}/>
                </button>
                <h3 className='shelf-title'>Disposition</h3>
                <div className='shelf-section'>
                    <h4 className='shelf-section-title'></h4>
                    <button className='button is-dark is-small'>Hey</button>
                    <button className='button is-dark is-small'>Hey</button>
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
            <div className='labBody'>
                <div className='columns'>
                    <div className='column'>
                        <div className='box'></div>
                    </div>
                    <div className='column'>
                        <div className='box'></div>
                    </div>
                    <div className='column'>
                        <div className='box'></div>
                    </div>
                    <div className='column'>
                        <div className='box'></div>
                    </div>
                </div>
                <button className="button is-dark" onClick={()=>navigate(-1)}>Go back</button>
            </div>
        )
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