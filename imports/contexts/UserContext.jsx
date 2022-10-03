import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-tag';
import { toast as TOASTER } from 'react-toastify';
import _ from 'lodash';

import InputString from '../ui/atoms/inputs/InputString';
import InputInt from '../ui/atoms/inputs/InputInt';
import InputFloat from '../ui/atoms/inputs/InputFloat';
import InputPercent from '../ui/atoms/inputs/InputPercent';

TOASTER.configure();

export const UserContext = React.createContext();

export const UserProvider = props => {
    const [platformSettings, setPlatformSettings] = useState({});
    const [initialized, setInitialized] = useState(null);
    const [user, setUser] = useState("loading");
    const [location, setLocation] = useState("");
    const [isActivated, setIsActivated] = useState("loading");
    const [isAdmin, setIsAdmin] = useState("loading");
    const [isOwner, setIsOwner] = useState("loading");
    const [avatar, setAvatar] = useState("loading");
    const [pagesTree, setPagesTree] = useState([]);
    const userQuery = gql` query user {user {
        _id
        firstname
        lastname
        mail
        isOwner
        isAdmin
        avatar
        activated
    }}`
    const pagesTreeQuery = gql` query pagesTree {
        pagesTree {
            _id
            entityUID
            parentUID
            title
            name
            url
            fullpath
            icon
            active
            sub{
                _id
                entityUID
                parentUID
                title
                name
                url
                fullpath
                icon
                active
                sub{
                    _id
                    entityUID
                    parentUID
                    title
                    name
                    url
                    fullpath
                    icon
                    active
                    sub{
                        _id
                        entityUID
                        parentUID
                        title
                        name
                        url
                        fullpath
                        icon
                        active
                    }
                }
            }
        }
    }`;
    const platformSettingsQuery = gql` query platform {
        platform {
            initialized
        }
    }`;
    const fieldTypes = [
        {
            typeName:"basic", icon:"brackets-curly", label:"Basic",
            types:[
                {name:"string",label:"Texte",input:InputString},
                {name:"int",label:"Nombre entier",input:InputInt},
                {name:"float",label:"Nombre décimal",input:InputFloat},
                {name:"percent",label:"Pourcentage",input:InputPercent},
            ]
        },
        {
            typeName:"physic", icon:"ruler-triangle", label:"Mesures physique",
            types:[
                {name:"weight",label:"Poid"},
                {name:"volume",label:"Volume"},
                {name:"gps",label:"Coordonées GPS"},
                {name:"distance",label:"Distance"},
                {name:"angle",label:"Angle"},
                {name:"length",label:"Longeur"},
                {name:"height",label:"Hauteur"},
                {name:"width",label:"Largeur"}
            ]
        },
        {
            typeName:"time", icon:"calendar-clock", label:"Temporel",
            types:[
                {name:"date",label:"Date"},
                {name:"time",label:"Heure"},
                {name:"timestamp",label:"Instant"},
                {name:"duration",label:"Durée"},
                {name:"age",label:"Age"},
                {name:"range",label:"Tranche horaire"}
            ]
        },
        {
            typeName:"coord", icon:"at", label:"Coordonées",
            types:[
                {name:"phone",label:"Téléphone"},
                {name:"link",label:"Lien"},
                {name:"mail",label:"Adresse e-mail"},
                {name:"address",label:"Adresse"},
                {name:"instagram",label:"Instagram"},
                {name:"twitter",label:"Twitter"},
                {name:"discord",label:"Discord"}
            ]
        },
        {
            typeName:"money", icon:"coin", label:"Monétaire",
            types:[
                {name:"amount",label:"Montant"},
                {name:"currency",label:"Monnaie"}
            ]
        },
        {
            typeName:"complex",icon:"file-alt", label:"Complexe",
            types:[
                {name:"rating",label:"Notation"},
                {name:"user",label:"Utilisateur"},
                {name:"step",label:"Processus"}
            ]
        },
        {
            typeName:"doc",icon:"square-list", label:"Documents",
            types:[
                {name:"pdf",label:"Fichier PDF"},
                {name:"file",label:"Fichier tout format"}
            ]
        },
        {
            typeName:"custom",icon:"atom", label:"Custom",
            types:[
                {name:"relation",label:"Relation"},
                {name:"status",label:"Status"}
            ]
        },
    ];
    const getFieldTypeLabel = type => {
        return _.flattenDeep(fieldTypes.map(t=>t.types)).filter(t=>t.name == type)[0].label;
    }
    const getFieldTypeInput = type => {
        return _.flattenDeep(fieldTypes.map(t=>t.types)).filter(t=>t.name == type)[0].input;
    }
    const toast = ({message,type}) => {
        if(type == 'error'){
            TOASTER(message,{type:TOASTER.TYPE.ERROR});
        }
        if(type == 'success'){
            TOASTER(message,{type:TOASTER.TYPE.SUCCESS});
        }
        if(type == 'info'){
            TOASTER(message,{type:TOASTER.TYPE.INFO});
        }
        if(type == 'warning'){
            TOASTER(message,{type:TOASTER.TYPE.WARNING});
        }
    }
    const toastQRM = data => {
        data.map(d=>{
            toast({message:d.message,type:d.status})
        })
    }
    const logout = () => {
        Meteor.logout(()=>{
            setUser("")
            props.client.cache.reset();
            props.client.resetStore();
        });
    }
    const loadUser = () => {
        props.client.query({
            query:userQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            if(user != undefined){
                if(user._id != data.user._id){
                    setUser(data.user)
                    setIsOwner(data.user.isOwner)
                    setIsAdmin(data.user.isAdmin)
                    setIsActivated(data.user.activated)
                    setAvatar(data.user.avatar)
                }
            }
        })
    }
    const loadPages = () => {
        props.client.query({
            query:pagesTreeQuery,
            fetchPolicy:"network-only",
        }).then(({data})=>{
            setPagesTree(data.pagesTree);
        })
    }
    const loadPlatformSettings = () => {
        props.client.query({
            query:platformSettingsQuery,
            fetchPolicy:"network-only",
        }).then(({data})=>{
            setPlatformSettings(data.platform);
            setInitialized(data.platform.initialized)
        })
    }

    useEffect (()=>{
        loadUser();
        loadPages();
        loadPlatformSettings();
    });

    return (
        <UserContext.Provider value={{
            fastyle: "duotone",
            user: user,
            pagesTree: pagesTree,
            isOwner: isOwner,
            isAdmin: isAdmin,
            isActivated: isActivated,
            initialized:initialized,
            avatar: avatar,
            fieldTypes: fieldTypes,
            getFieldTypeLabel: getFieldTypeLabel,
            getFieldTypeInput: getFieldTypeInput,
            loadUser: loadUser,
            loadPages: loadPages,
            toast: toast,
            toastQRM: toastQRM,
            logout: logout,
            client: props.client
        }}>
            {props.children}
        </UserContext.Provider>
    );
}