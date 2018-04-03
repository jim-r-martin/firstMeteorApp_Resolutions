import { Meteor } from 'meteor/meteor';

Resolutions = new Mongo.Collection('resolutions');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('resolutions', function(){
  return Resolutions.find({owner: this.userId});
});

Meteor.methods({
  addResolution: function(title){
    Resolutions.insert({
      title: title,
      createdAt: new Date(),
      owner: Meteor.userId(),
      subTitle: []
    });
  },
  deleteResolution: function(id){
    var res = Resolutions.findOne(id);
    if(res.owner  !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.remove(id);
  },
  updateResolution: function(id, checked){
    Resolutions.update(id,{$set: {checked: checked}})
  },
  setAddition: function(id, add){
    var res = Resolutions.findOne(id)
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.update(id,{$set: {add: add}})
  },
  submitSubResolution: function(id,subTitle){
    Resolutions.update(id,
      {$push: {subTitle: ' ' + subTitle}}
    )
  }
});
