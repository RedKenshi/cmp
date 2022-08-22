import React, { useState, useEffect } from 'react';

export const CrudEntityRow = props => {

    useEffect(()=>{
        console.log(props.crudEntity);
    },[])

    return (
        <tr>
           <td></td>
           <td></td>
           <td></td>
        </tr>
    )
}

export default CrudEntityRow;