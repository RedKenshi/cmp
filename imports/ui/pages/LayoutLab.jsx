


import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

export const LayoutLab = props => {
    
    const navigate = useNavigate();
    const [rightShelfExpanded,setRightShelfExpanded] = useState(true);
    const [leftShelfExpanded,setLeftShelfExpanded] = useState(true);

    const getLeftShelf = () => {
        return(
            <div className={'leftShelf shelf' + (leftShelfExpanded ? " expanded" : " collapsed ")}>
                <button className="button collapse-control is-small is-round is-dark" onClick={()=>setLeftShelfExpanded(!leftShelfExpanded)}>
                    <i className={'fa-light ' + (leftShelfExpanded ? "fa-chevron-left" : "fa-chevron-right")}/>
                </button>
                <h3 className='shelf-title'>Data</h3>
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