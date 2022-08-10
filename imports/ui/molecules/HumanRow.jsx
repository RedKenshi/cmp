import React, { useState, useEffect } from 'react';

export const Humans = props => {

    useEffect(()=>{
        console.log(props.human);
    },[])

    return (
        <div className='human card'>
            {props.human}
        </div>
    )
}

export default Humans;