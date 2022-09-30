import { Meteor } from 'meteor/meteor';

export default {
    Query : {
        async platform(obj, args){
            return {
                initialized : Meteor.users.find().count() > 0
            }
        }
    }
}
