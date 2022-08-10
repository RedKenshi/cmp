import React from "react";


const LayoutTile = props => {
    return (
        <div className="layout-tile box" onClick={()=>props.setLayout(props.layout)}>
            <i className="fa-duotone fa-table-layout"/>
            <p>{props.layout.name}</p>
        </div>
    )
}
  
export default LayoutTile;