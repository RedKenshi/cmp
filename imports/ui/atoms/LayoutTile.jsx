import React from "react";


const LayoutTile = props => {
    return (
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    {props.layout.label}
                </p>
                <button class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fa-duotone fa-table-layout" aria-hidden="true"></i>
                </span>
                </button>
            </header>
            <div class="card-content">
                <div class="content">
                    Ce type de page sert afficher les instances d'une structure, d'en créer, d'en supprimer et d'en modifier.
                </div>
            </div>
            <footer class="card-footer">
                <a onClick={()=>props.setLayout(props.layout)} class="card-footer-item">Choisir</a>
            </footer>
        </div>
    )
}
  
export default LayoutTile;