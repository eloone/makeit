Meteor.startup(function () {

	Backbone.history.start({pushState: true});
	console.log(Points.find().fetch());

});

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
