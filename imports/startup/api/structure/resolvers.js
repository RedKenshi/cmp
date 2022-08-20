import Structures from './structures.js';
import StructureFields from './structureFields';
import { Mongo } from 'meteor/mongo';

const loadFields = structure => {
    let fields = StructureFields.find({structure:structure._id._str}).fetch() || {};
    structure.fields = fields;
    console.log(structure)
    return structure;
}

export default {
    Query : {
        async structure(obj, {uid}, { user }){
            let structure = Structures.findOne({entityUID:uid});
            return loadFields(structure)
        },
        async structures(obj, args){
            return Structures.find({}).fetch() || {};
        },
    },
    Mutation:{
        async addStructure(obj,{label,name,icon},{user}){
            if(user._id){
                Structures.insert({
                    _id:new Mongo.ObjectID(),
                    entityUID: Math.floor(Math.random()*999999),
                    label: label,
                    name: name.toLowerCase().replace(" ","-"),
                    icon: icon.toLowerCase()
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteStructure(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Structures.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Structure deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async addFieldToStructure(obj,{_id,label,name,type},{user}){
            if(user._id){
                StructureFields.insert({
                    _id:new Mongo.ObjectID(),
                    structure: _id,
                    name: name,
                    label: label,
                    type: type
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}