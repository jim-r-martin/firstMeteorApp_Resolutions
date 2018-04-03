import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Resolutions = new Mongo.Collection('resolutions');

Meteor.subscribe('resolutions');

Template.body.helpers({
  resolutions: function(){
    if(Session.get('hideFinished')){
        return Resolutions.find({checked: {$ne: true}}); //ne means not equal
    }
  return Resolutions.find();
  }
});

Template.resolution.helpers({
  isOwner: function(){
    return Template.instance().data.owner === Meteor.userId();
  },
  subTitles: function(subTitle){
    var subTitleString = ''
    for(i=0;i<subTitle.length;i++){
      subTitleString += subTitle[i] + '\n'
    }
    return subTitleString;
  }
})

Template.body.events({
  'submit .new-resolution': function(event){
    var title = event.target.title.value;

    Meteor.call('addResolution',title);

    event.target.title.value = '';
    event.preventDefault();
  },
  'change .hide-finished': function(event){       //'type of event .class' format style
    Session.set('hideFinished',event.target.checked)
  },
  'submit .new-sub-resolution': function(event){
    var subTitle = event.target.subTitle.value;
    Meteor.call('submitSubResolution',this._id,subTitle);
    subTitle = '';
  }
});

Template.resolution.events({
  'click .toggle-checked': function(){
    Meteor.call('updateResolution',this._id,!this.checked)
  },
  'click .delete': function(){
    Meteor.call('deleteResolution',this._id);
  },
  'click .toggle-addition': function(){
    Meteor.call('setAddition',this._id, !this.add)
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
