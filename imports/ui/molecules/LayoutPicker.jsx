import React from "react";
import LayoutTile from "../atoms/LayoutTile";

const LayoutPicker = props => {

    const layouts = [
        {label:"CRUD",name:"crud"},
    ]

    return (
        <div className="layout-picker is-fullwidth">
            {layouts.map(l=>
                <LayoutTile setLayout={props.setLayout} layout={l}/>
            )}
        </div>
    )
}
  
export default LayoutPicker;