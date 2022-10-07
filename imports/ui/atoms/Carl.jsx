import React, { useState, useEffect } from 'react';

const Carl = props => {
    const getStyle = () => {
        let style = {"background":"linear-gradient(150deg,#09C6F9,#045DE9);"};
        return style;
    }
    return (
        <div className="carl-wrapper">
            <div className='ring-outter'>
                <div className='ring-inner'>
                </div>
            </div>
        </div>
    )    
}

export default Carl;