import Pages from './pages.js';
import { Mongo } from 'meteor/mongo';

const loadPagesSubpages = pages => {
    pages.forEach(page => {
        let subs = Pages.find({parentUID:page.entityUID}).fetch() || {};
        if(subs.length > 0){
            subs = loadPagesSubpages(subs);
            page.sub = subs;
        }else{
            page.sub = [];
        }
    });
    return pages;
}
const loadPageSubpages = page => {
    let subs = Pages.find({parentUID:page.entityUID}).fetch() || {};
    if(subs.length > 0){
        subs = loadPagesSubpages(subs);
        page.sub = subs;
    }else{
        page.sub = [];
    }
    return page;
}

export default {
    Query : {
        async page(obj, {_id}, { user }){
            return Pages.findOne(_id);
        },
        async pages(obj, args){
            return Pages.find({}).fetch() || {};
        },
        async pagesTree(obj, args){
            let pages = Pages.find({parentUID:0}).fetch() || {};
            pages = loadPagesSubpages(pages);
            return pages;
        },
        async pageAndSubTree(obj,{url},{user}){
            let page = Pages.findOne({url:url}) || {};
            page = loadPageSubpages(page);
            return page;
        }
    },
    Mutation:{
        async addPage(obj,{title,icon,parentUID},{user}){
            if(user._id){
                Pages.insert({
                    _id:new Mongo.ObjectID(),
                    entityUID: Math.floor(Math.random()*999999),
                    parentUID: parentUID,
                    title: title,
                    icon: icon,
                    url: "/"+title.toLowerCase().replace(" ","-"),//need to concat with parent url
                    active: false,
                    name: title.toLowerCase().replace(" ","-"),
                    layout:null
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deletePage(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Pages.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Page deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async toggleActive(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    const page = Pages.findOne(new Mongo.ObjectID(_id));
                    Pages.update({
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "active": !page.active,
                        }
                    });
                    return [{status:"success",message:(page.active ? 'Page deactivated' : 'Page activated')}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async setLayout(obj,{_id,layout},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    const page = Pages.findOne(new Mongo.ObjectID(_id));
                    Pages.update({
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "layout": layout,
                        }
                    });
                    return [{status:"success",message:"Layout set"}];
                }
                return [{status:"error",message:'Error while setting layout'}];
            }
            throw new Error('Unauthorized')
        }
    }
}