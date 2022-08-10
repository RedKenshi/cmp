import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-calendar';

import Button from "../elements/Button";

export default ModalGenericDatePicker = props => {
    const [selected,setSelected] = useState(props.selected)
    const onValidate = () => {
        props.onValidate(props.target,selected);
    }
    return (
        <div className={"modal" + (props.open != false ? " is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.headerLabel}</p>
                    <button className="delete" aria-label="close" onClick={props.close}/>
                </header>
                <section className="modal-card-body">
                    <Calendar />
                </section>
                <footer className="modal-card-foot">
                    <Button icon="fa-light fa-arrow-left" text="Annuler" onClick={props.close}/>
                    <Button color="primary" icon="fa-light fa-check" text="Choisir" onClick={onValidate}/>
                </footer>
            </div>
        </div>
    )
}