import React from "react";
import LayoutTile from "../atoms/LayoutTile";

const LayoutPicker = props => {

    const layouts = [
        {name:"Crud",_id:001},
        {name:"Layout 002",id:002},
        {name:"Layout 003",id:003},
        {name:"Layout 004",id:004},
        {name:"Layout 005",id:005},
        {name:"Layout 006",id:006}
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