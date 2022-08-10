
const formatUser = user => {
    user.mail = user.emails[0].address
    user.firstname = user.profile.firstname
    user.lastname = user.profile.lastname
    user.avatar = user.profile.avatar
    user.activated = user.settings.activated
    user.isOwner = user.settings.isOwner
    user.isAdmin = user.settings.isAdmin
}

export default {
    Query : {
        async user(obj, args, { user }){
            let userFull = {};
            if(user != undefined){
                userFull = Meteor.users.findOne({_id:user._id})
                formatUser(userFull)
            }
            return userFull || {}
        },
        async allUsers(obj, args){
            let users = Meteor.users.find({}).fetch() || {};
            return users
        },
        async accounts(obj, args, {user}){
            let users = Meteor.users.find().fetch();
            users.forEach(user=> {
                formatUser(user)
            });
            return users
        }
    },
    Mutation:{
        async setAdmin(obj,{admin,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:user._id});
                if(adminUser.settings.isAdmin){
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.isAdmin": admin,
                        }
                    });
                    return [{status:"success",message:'Admin power given successfully'}];
                }
                return [{status:"success",message:'Error while giving ownership'}];
            }
            throw new Error('Unauthorized')
        },
        async setOwner(obj,{owner,_id},{user}){
            if(user._id){
                const ownerUser = Meteor.users.findOne({_id:user._id});
                if(ownerUser.settings.isOwner){
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.isOwner": owner,
                        }
                    });
                    return [{status:"success",message:'Ownership given successfully'}];
                }
                return [{status:"success",message:'Error while giving ownership'}];
            }
            throw new Error('Unauthorized')
        },
        async activateAccount(obj,{activate,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:user._id});
                if(adminUser.settings.isAdmin){
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.activated": activate,
                        }
                    });
                    return [{status:"success",message:'Activation successful'}];
                }
                return [{status:"success",message:'Error while activation'}];
            }
            throw new Error('Unauthorized')
        },
        async deleteAccount(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Meteor.users.remove(_id);
                    return [{status:"success",message:'Account deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async setAvatar(obj,{_id,avatar,collection},{user}){
            if(user._id){
                const res = Meteor.users.update(
                    {
                        _id: _id
                    }, {
                        $set: {
                            "profile.avatar": collection+"/"+avatar
                        }
                    }
                );
                return [{status:"success",message:'Edit successful'}];
            }
            throw new Error('Unauthorized')
        }
    }
}