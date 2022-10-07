import Layouts from './layouts.js';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        async layout(obj, {_id}, { user }){
            return Layouts.findOne(new Mongo.ObjectID(_id));
        },
        async layouts(obj, args){
            return Layouts.find({}).fetch() || {};
        }
    },
    Mutation:{
        async addLayout(obj,{title,icon,parentId},{user}){
            if(user._id){
                Layouts.insert({
                    _id:new Mongo.ObjectID(),
                    parentId: parentId,
                    title: title,
                    icon: icon,
                    url: "/"+title.toLowerCase().replace(" ","-"),//need to concat with parent url
                    active: false,
                    name: title.toLowerCase().replace(" ","-")
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteLayout(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Layouts.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Layout deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        }
    }
}