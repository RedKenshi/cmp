import React, { useState, useEffect, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import CrudEntityRow from '../molecules/CrudEntityRow';
import ModalGenericDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'graphql-tag';

export const Crud = props => {
    
    const fieldTypes = [
        {
            typeName:"required",
            color:"primary",
            icon:"circle-exclamation",
            label:"Champs requis"
        },
        {
            typeName:"optional",
            color:"link",
            icon:"brackets-curly",
            label:"Champs optionnels"
        }
    ]
    const [modalActiveFieldType, setModalActiveFieldType] = useState("required")
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
    const getFieldTypeMenu = () => {
        return (
            <ul >
                {fieldTypes.map(ft=>{
                    return (
                        <li className={(modalActiveFieldType == ft.typeName ? "is-active" : "")}>
                            <a onClick={()=>setModalActiveFieldType(ft.typeName)}>
                                <span className="icon">
                                    <i className={"fa-"+props.fastyle + " fa-"+ft.icon} aria-hidden="true"></i>
                                </span>
                                <span>{ft.label}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        )
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
            <ModalGenericDatePicker open={openModalDate} close={closeModalDate} headerLabel={"Header here"} selected={new Date()}onValidate={onValidateDatePicker} target={"datePickerTarget"}/>
            <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Créer une instance de la structure</p>
                        <button className="delete" aria-label="close" onClick={closeModalAdd}/>
                    </header>
                    <div className='modal-card-body'>
                        <div className="columns">
                            <div className="column is-narrow">
                                <div className="tabs vertical margined-top16 fullwidth">
                                    {getFieldTypeMenu()}
                                </div>
                            </div>
                            <div className="column">
                                {!loading && Array.from(structureRaw.fields).filter(f => f.requiredAtCreation == (modalActiveFieldType == "required")).map(f=>{
                                    return(
                                        <div key={f._id} className='field'>
                                            <p className="control has-icons-right">
                                                <input className={"input " + (f.requiredAtCreation ? " is-primary" : "")} placeholder={f.label} />
                                                <span className="icon is-small is-right is-primary">
                                                    <i className="fa-solid fa-circle-exclamation"></i>
                                                </span>
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
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