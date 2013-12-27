//this is loaded after collections definition
//but before any active client code
Meteor.subscribe('userData', function(){
	Session.set('userReady', true);
});

Meteor.subscribe('tagData', function(){

	var alltag = Tags.findOne({alias : 'all'});

Session.set('alltagId', alltag._id);
Session.set('tagsReady', true);
});

Meteor.subscribe('tasksData', function(){
	Session.set('tasksReady', true);
});