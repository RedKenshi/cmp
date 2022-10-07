import Pages from './pages.js';
import { Mongo } from 'meteor/mongo';

const getFullPath = (parentId,url) => {
    if(parentId == "root"){
        return url;
    }else{
        let parent = Pages.findOne(new Mongo.ObjectID(parentId))
        let fullpath = parent.url + url;
        return getFullPath(parent.parentId,fullpath)
    }
}

//RECURSIVE
const loadPagesSubpagesTree = pages => {
    pages.forEach(page => {
        let subs = Pages.find({parentId:page._id._str}).fetch() || {};
        if(subs.length > 0){
            subs = loadPagesSubpagesTree(subs);
            page.sub = subs;
        }else{
            page.sub = [];
        }
    });
    return pages;
}
//RECURSIVE
const loadPageSubpagesTree = page => {
    let subs = Pages.find({parentId:page._id._str}).fetch() || {};
    if(subs.length > 0){
        subs = loadPagesSubpagesTree(subs);
        page.sub = subs;
    }else{
        page.sub = [];
    }
    return page;
}
//NOT RECURSIVE
const loadPageSubpages = page => {
    let subs = Pages.find({parentId:page._id._str}).fetch() || {};
    if(subs.length > 0){
        page.sub = subs.filter(s=>s.active);
    }else{
        page.sub = [];
    }
    return page;
}

export default {
    Query : {
        async page(obj, {_id}, { user }){
            return Pages.findOne(new Mongo.ObjectID(_id));
        },
        async pages(obj, args){
            return Pages.find({}).fetch() || {};
        },
        async pagesTree(obj, args){
            let pages = Pages.find({parentId:"root"}).fetch() || {};
            pages = loadPagesSubpagesTree(pages);
            return pages;
        },
        async pageAndSubTree(obj,{url},{user}){
            let page = Pages.findOne({url:url}) || {};
            page = loadPageSubpagesTree(page);
            return page;
        },
        async pageAndSubs(obj,{url},{user}){
            let page = Pages.findOne({fullpath:url}) || {};
            page = loadPageSubpages(page);
            return page;
        },
        async parentsPageToTop(obj,{url},{user}){
            let page = Pages.findOne({fullpath:url}) || {};
            let currentParentId = page.parentId;
            let pages = [page];
            while (currentParentId != "root"){                
                let parent = Pages.findOne(new Mongo.ObjectID(pages[pages.length-1].parentId)) || {};
                currentParentId = parent.parentId
                pages.push(parent);
            }
            return pages.reverse();
        }
    },
    Mutation:{
        async addPage(obj,{title,icon,parentId},{user}){
            if(user._id){
                const url = "/"+title.toLowerCase().replace(" ","-");
                Pages.insert({
                    _id:new Mongo.ObjectID(),
                    parentId: parentId,
                    title: title,
                    icon: icon,
                    url: url,
                    fullpath:getFullPath(parentId,url),
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
        async setLayout(obj,{_id,layout,layoutOptions},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    const page = Pages.findOne(new Mongo.ObjectID(_id));
                    Pages.update({
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "layout": layout,
                            "layoutOptions": [...layoutOptions]
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