


import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

export const LayoutLab = props => {
    
    const navigate = useNavigate();
    const [rightShelfExpanded,setRightShelfExpanded] = useState(false);
    const [leftShelfExpanded,setLeftShelfExpanded] = useState(false);

    const getLeftShelf = () => {
        return(
            <div className='leftShelf shelf'>
                <button onClick={()=>setLeftShelfExpanded(!leftShelfExpanded)}>
                    <i className={'fa-light ' + (leftShelfExpanded ? "fa-minimize" : "fa-maximize")}/>
                </button>
            </div>
        )
    }
    const getRightShelf = () => {
        return(
            <div className='rightShelf shelf'>
                <button onClick={()=>setRightShelfExpanded(!rightShelfExpanded)}>
                    <i className={'fa-light ' + (rightShelfExpanded ? "fa-minimize" : "fa-maximize")}/>
                </button>
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

    return(
        <div className={"lab" + (leftShelfExpanded ? " leftExpanded " : " leftCollapsed ") + (rightShelfExpanded ? " rightExpanded" : " rightCollapsed")}>
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