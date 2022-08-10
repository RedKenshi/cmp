import '../imports/startup/server';
import { Meteor } from 'meteor/meteor';
import { padStart } from 'lodash';

Accounts.onCreateUser(function(options, user) {    
  // Use provided profile in options, or create an empty object
  user.profile = options.profile || {};
  user.profile.firstname = options.profile.firstname;
  user.profile.lastname = options.profile.lastname;
  user.profile.avatar = "animals/"+padStart(Math.floor(Math.random() * 60),3,"0");
  user.settings = options.settings || {};
  if(Meteor.users.find().count() == 0){
      user.settings.isOwner = true;
      user.settings.isAdmin = true;
      user.settings.activated = true;
  }else{
      user.settings.isOwner = false;
      user.settings.isAdmin = false;
      user.settings.activated = false;
  }
  // Returns the user object
  return user;
});