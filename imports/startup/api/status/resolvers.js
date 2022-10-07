import Statuses from './statuses.js';
import StatusValues from './statusValues';
import { Mongo } from 'meteor/mongo';

const loadValues = status => {
    let values = StatusValues.find({status:status._id._str}).fetch() || {};
    status.values = values;
    return status;
}

export default {
    Query : {
        async status(obj, {_id}, { user }){
            let status = Statuses.findOne(new Mongo.ObjectID(_id));
            return loadValues(status)
        },
        async statuses(obj, args){
            return Statuses.find({}).fetch() || {};
        },
    },
    Mutation:{
        async addStatus(obj,{label},{user}){
            if(user._id){
                Statuses.insert({
                    _id:new Mongo.ObjectID(),
                    label: label,
                    name: label.toLowerCase().replace(" ","-")
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteStatus(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Statuses.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Status deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async addValueToStatus(obj,{_id,label},{user}){
            if(user._id){
                StatusValues.insert({
                    _id:new Mongo.ObjectID(),
                    status: _id,
                    label: label
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteValueFromStatus (obj,{_id},{user}){
            if(user._id){
                StatusValues.remove({
                    _id:new Mongo.ObjectID(_id),
                });
                return [{status:"success",message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}
