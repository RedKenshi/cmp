import Structures from './structures.js';
import StructureFields from './structureFields';
import { Mongo } from 'meteor/mongo';

const getCol = name => {
    let col;
    try {
        col = new Mongo.Collection(name);
    } catch (error) {
        col = Mongo.Collection.get(name);
    }
    return col
}
const toColumns = i => {
    const cols = []
    for (const [key, value] of Object.entries(i)) {
        if(key != "_id"){
            cols.push({
                fieldId:key,
                value:value
            })
        }
    }
    return cols;
}
const loadFields = structure => {
    let fields = StructureFields.find({structure:structure._id._str}).fetch() || {};
    structure.fields = fields;
    return structure;
}

export default {
    Query : {
        async structure(obj, {uid}, { user }){
            let structure = Structures.findOne({entityUID:uid});
            return loadFields(structure);
        },
        async structures(obj, args){
            return Structures.find({}).fetch() || {};
        },
        async structureInstances(obj,{_id},{user}){
            let col = getCol(_id);
            let instances = col.find({}).fetch();
            let is = instances.map(i => {
                return ({
                    _id:i._id,
                    columns: toColumns(i)
                })
            })
            return is;   
        },
        async structureInstance(obj,{instance},{user}){
            return {};
        }
    },
    Mutation:{
        async addStructure(obj,{label,name},{user}){
            if(user._id){
                Structures.insert({
                    _id:new Mongo.ObjectID(),
                    entityUID: Math.floor(Math.random()*999999),
                    label: label,
                    name: name.toLowerCase().replace(" ","-")
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
        async addFieldToStructure(obj,{_id,label,name,type,requiredAtCreation,searchable},{user}){
            if(user._id){
                StructureFields.insert({
                    _id:new Mongo.ObjectID(),
                    structure: _id,
                    name: name,
                    label: label,
                    type: type,
                    requiredAtCreation:requiredAtCreation,
                    searchable:searchable
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteFieldFromStructure (obj,{_id},{user}){
            if(user._id){
                StructureFields.remove({
                    _id:new Mongo.ObjectID(_id),
                });
                return [{status:"success",message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async addStructureInstance(obj,{structureId,columns},{user}){
            const InstancesCollection = getCol(structureId);
            InstancesCollection.insert({"_id":new Mongo.ObjectID(),...JSON.parse(columns)})
            return [{status:"success",message:'Création réussie'}];
        },
        async deleteStructureInstance(obj,{structureId,instanceId},{user}){
            const InstancesCollection = getCol(structureId);
            InstancesCollection.remove({
                _id:new Mongo.ObjectID(instanceId),
            });
            return [{status:"success",message:'Création réussie'}];
        }
    }
}
