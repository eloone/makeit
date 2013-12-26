Meteor.startup(function () {
	Backbone.history.start({pushState: true});

	console.log(Tags.find());

	var alltag = Tags.findOne({alias : 'all'});

	if(alltag){
		Session.set('alltagId', alltag._id);
	}
	else{
		Meteor.call('addTag', {label : 'all'});
	}

});


Meteor.subscribe('userData');

Meteor.subscribe('tagData');

Template.main.page404 = function(){
	return Session.get('page404');
};

Template.main.home = function(){
	return Session.get("home");
};

Template.main.tag = function(){
	return Session.get("tag");
};

Template.main.new = function(){
	return Session.get("new");
};
