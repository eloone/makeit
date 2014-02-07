//this is loaded after collections definition
//but before any active client code
/*Meteor.subscribe('userData', function(){
	Session.set('userReady', true);
});

Meteor.subscribe('tagData', function(){
	Session.set('tagsReady', true);
});

Meteor.subscribe('tagAll', function(){

	var alltag = Tags.findOne();
	console.log(alltag);

	if(alltag){
		Session.set('alltagId', alltag._id);
	}

	Session.set('tagsReady', true);
});

Meteor.subscribe('tasksData', function(){
	Session.set('tasksReady', true);
});

Meteor.subscribe('pointsData', function(){
	Session.set('pointsReady', true);
});*/