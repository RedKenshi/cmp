import React, { useState, useEffect, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import CrudEntityRow from '../molecules/CrudEntityRow';
import ModalGenericDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'graphql-tag';

export const Crud = props => {
    
    const [crudEntitiesRaw,setCrudEntitiesRaw] = useState([]);
    const [structureRaw,setStructureRaw] = useState([]);
    const [layoutOptions,setLayoutOptions] = useState(JSON.parse(props.layoutOptions));
    const [loading,setLoading] = useState(true);
    const [openModalDate,setOpenModalDate] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);

    const structureQuery = gql` query structure($uid: Int!) {
        structure(uid:$uid) {
            _id
            entityUID
            icon
            fields{
                _id
                label
                name
                type
                requiredAtCreation
            }
            label
            name
        }
    }`;

    const onValidateDatePicker = (target,value) => {
        closeModal();
    }
    const closeModalDate = () => {
        setOpenModalDate(false)
    }
    const closeModalAdd = () => {
        setOpenModalAdd(false)
    }
    const loadStructure = () => {
        props.client.query({
            query:structureQuery,
            fetchPolicy:"network-only",
            variables:{
                uid:parseInt(layoutOptions.structureEntityUID),
            }
        }).then(({data})=>{
            console.log(data.structure)
            setStructureRaw(data.structure);
            setLoading(false)
        })
    }

    useEffect(()=>{
        loadStructure()
    },[])

    return (
        <Fragment>
            <div className='box basic-crud-search-layout'>
                <div>
                    <input className='input' type="text"/>
                </div>
                <div>
                    <button className='button is-light is-link' onClick={()=>setOpenModalAdd(true)}>
                        <i className='fa-regular fa-plus'/>
                    </button>
                </div>
                <div className='entries-container'>
                    {crudEntitiesRaw.map(ce=>
                        <CrudEntityRow crudEntity={ce} />
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
                        {!loading && structureRaw.fields.map(f=>{
                            return(
                                <div className='field'>
                                    <label className='label'>{}</label>
                                    <input placeholder={f.label} type="text" className='input' />
                                </div>
                            )
                        })}
                    </section>
                    <footer className="modal-card-foot">
                        <button className='button' onClick={closeModalAdd}>
                            <i className='fa-light fa-arrow-left'/>
                            Annuler
                        </button>
                        <button className="button is-primary" onClick={()=>console.log("CREATE STRUCTURE INSTANCE")}>
                            <i className='fa-light fa-check'/>
                            Créer
                        </button>
                    </footer>
                </div>
            </div>
        </Fragment>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)
  
export default wrappedInUserContext = withUserContext(Crud);