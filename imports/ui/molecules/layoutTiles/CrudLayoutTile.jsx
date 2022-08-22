import React, { useState, Fragment } from "react";
import StructurePicker from "../../atoms/StructurePicker";


const CrudLayoutTile = props => {

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
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        CRUD
                    </p>
                    <button class="card-header-icon" aria-label="more options">
                    <span class="icon">
                        <i class="fa-duotone fa-table-layout" aria-hidden="true"></i>
                    </span>
                    </button>
                </header>
                <div class="card-content">
                    <div class="content">
                        Ce type de page sert à afficher les instances d'une structure, d'en créer, d'en supprimer et d'en modifier.
                    </div>
                </div>
                <footer class="card-footer">
                    <a onClick={showModalOptions} class="card-footer-item">Choisir</a>
                </footer>
            </div>
            <div className={"modal" + (openModalOptions != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Cette page concernera quelle structure ?</p>
                        <button className="delete" aria-label="close" onClick={closeModalOptions}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="columns">
                            <div className="column flex align center">
                                <StructurePicker onChange={handleStructureChange} />
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalOptions}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-primary" onClick={setLayout}>
                            <i className='fa-light fa-check'/>
                            Confirmer
                        </button>
                    </footer>
                </div>
            </div>
        </Fragment>
    )
}
  
export default CrudLayoutTile;