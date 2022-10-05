import React, { useState, Fragment } from "react";

const DashboardLayoutTile = props => {

    const [openModalOptions, setOpenModalOptions] = useState(false);
    const [layoutOptions, setLayoutOptions] = useState([]);
    const handleStructureChange = e => {
        setLayoutOptions([
            ...layoutOptions,
            {structureEntityUID:e.target.value}
        ])
    }
    const setLayout = () => {
        props.setLayout({
            layout:"crud",
            layoutOptions: layoutOptions
        })
        closeModalOptions()
    }

    const closeModalOptions = () => {
        setOpenModalOptions(false)
    }
    const showModalOptions = () => {
        setOpenModalOptions(true)
    }

    return (
        <Fragment>
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        Dashboard
                    </p>
                    <button className="card-header-icon" aria-label="more options">
                    <span className="icon">
                        <i className="fa-duotone fa-table-layout" aria-hidden="true"></i>
                    </span>
                    </button>
                </header>
                <div className="card-content">
                    <div className="content">
                        Ce type de page sert à afficher les KPI basés sur les données de la plateforme
                    </div>
                </div>
                <footer className="card-footer">
                    <a onClick={showModalOptions} className="card-footer-item">Choisir</a>
                </footer>
            </div>
            <div className={"modal" + (openModalOptions != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">WIP</p>
                        <button className="delete" aria-label="close" onClick={closeModalOptions}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="columns">
                            Work in progress
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalOptions}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                    </footer>
                </div>
            </div>
        </Fragment>
    )
}
  
export default DashboardLayoutTile;