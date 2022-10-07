import { Mongo } from 'meteor/mongo';
import Structures from './../structure/structures';
import StructureFields from './../structure/structureFields';
import Pages from './../page/pages';

const getCol = name => {
    let col;
    try {
        col = new Mongo.Collection(name);
    } catch (error) {
        col = Mongo.Collection.get(name);
    }
    return col
}

export default {
    Mutation:{
        async resetDB(obj,arg,{user}){
            if(user._id){
                let structures = Structures.find({}).fetch() || {};
                structures.map(s=>{
                    let col = getCol(s._id._str);
                    col.rawCollection().drop((err,success)=>{
                        Structures.remove(s._id);
                        StructureFields.remove({structure:s._id._str});
                    });
                });
                StructureFields.rawCollection().drop();
                Structures.rawCollection().drop();
                Pages.rawCollection().drop();
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async factoryReset(obj,arg,{user}){
            if(user._id){
                let structures = Structures.find({}).fetch() || {};
                structures.map(s=>{
                    let col = getCol(s._id._str);
                    col.rawCollection().drop((err,success)=>{
                        Structures.remove(s._id);
                        StructureFields.remove({structure:s._id._str});
                    });
                });
                StructureFields.rawCollection().drop();
                Structures.rawCollection().drop();
                Pages.rawCollection().drop();
                Meteor.users.remove({})
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        }
    }
}