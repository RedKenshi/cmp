import React from "react";
import { useNavigate } from 'react-router-dom';

const AdministrationMenu = props => {

    const navigate = useNavigate();

    return (
        <div className="box">
            <p className="menu-label">Settings</p>
            <ul className="menu-list">
                <li onClick={()=>navigate("/admin/pages")}>
                    <a className={props.active == "pages" ? "is-active" : ""}>Pages</a>
                </li>
                <li onClick={()=>navigate("/admin/structures")}>
                    <a className={props.active == "structures" ? "is-active" : ""}>Structures</a>
                </li>
                <li onClick={()=>navigate("/admin/status")}>
                    <a className={props.active == "statuses" ? "is-active" : ""}>Status</a>
                </li>
            </ul>
            <p className="menu-label">Administration</p>
            <ul className="menu-list">
                <li onClick={()=>navigate("/admin/accounts")}>
                    <a className={props.active == "accounts" ? "is-active" : ""}>User Accounts</a>
                </li>
                <li onClick={()=>navigate("/admin/demo")}>
                    <a className={props.active == "demo" ? "is-active" : ""}>Demo</a>
                </li>
            </ul>
        </div>
    )
}

export default (AdministrationMenu);