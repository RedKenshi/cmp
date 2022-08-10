import React, { useState, useEffect, Fragment } from 'react';
import HumanRow from '../molecules/HumanRow';
import ModalBodyContentDatePicker from '../atoms/ModalDatePicker';
import Button from "../elements/Button";

export const Humans = props => {
    
    const [humansRaw,setHumansRaw] = useState([]);
    const [openModalDate,setOpenModalDate] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);

    const onValidateDatePicker = (target,value) => {
        console.log(value.getDate().toString().padStart(2, '0')+"/"+parseInt(value.getMonth()+1).toString().padStart(2, '0')+"/"+value.getFullYear().toString().padStart(4, '0'))
        closeModal();
    }
    const closeModalDate = () => {
        setOpenModalDate(false)
    }
    const closeModalAdd = () => {
        setOpenModalAdd(false)
    }

    useEffect(()=>{
    },[])

    return (
        <Fragment>
            <div className='basic-crud-search-layout'>
                <div>
                    <input className='input' type="text"/>
                </div>
                <div>
                    <button className='button is-light is-info' onClick={()=>setOpenModalAdd(true)}>
                        <i className='fa-regular fa-plus'/>
                    </button>
                </div>
                <div className='entries-container'>
                    {humansRaw.map(h=>
                        <HumanRow human={h} />
                    )}
                </div>
            </div>
            <ModalGenericDatePicker
                open={openModalDate}
                close={closeModalDate}
                headerLabel={"Header here"}
                selected={new Date()}
                onValidate={onValidateDatePicker}
                target={"datePickerTarget"}
            />
            <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Ajouter un humain</p>
                        <button className="delete" aria-label="close" onClick={props.close}/>
                    </header>
                    <section className="modal-card-body">
                        <input type="text" className='input' />
                        <input type="text" className='input' />
                        <input type="text" className='input' />
                    </section>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalAdd}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-primary" onClick={console.log("Create")}>
                            <i className='fa-light fa-check'/>
                            Créer
                        </button>
                    </footer>
                </div>
            </div>
        </Fragment>
    )
}

export default Humans;