//this is loaded after collections definition
//but before any active client code
Session.set('tasksReady', false);
Session.set('tagsReady', false);
Session.set('userReady', false);

//sets up subscriptions
Meteor.subscribe('userData', function(){
	Session.set('userReady', true);
});

Meteor.subscribe('tagData', function(){
	Session.set('tagsReady', true);
});

Meteor.subscribe('tagAll', function(){

	var alltag = Tags.findOne({alias : 'all'});

	if(alltag){
		Session.set('alltagId', alltag._id);
	}

	Session.set('tagAllReady', true);
});

Meteor.subscribe('tasksData', function(){
	Session.set('tasksReady', true);
});

Meteor.subscribe('pointsData', function(){
	Session.set('pointsReady', true);
});

//if(Meteor.user()){
//	Meteor.call('initPoints', Meteor.userId());
//		console.log('initPoints ok');
//}

Deps.autorun(function(c){
	 if (! Meteor.userId())
        return;

      c.stop();
      Meteor.call('initPoints', Meteor.userId());    
});