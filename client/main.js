Meteor.startup(function () {

	Backbone.history.start({pushState: true});

});

Template.main.page404 = function(){
	return Session.get('page404');
};

Template.main.dashboard = function(){
	return Session.get("dashboard");
};

Template.main.tag = function(){
	return Session.get("tag");
};

Template.main.new = function(){
	return Session.get("new");
};

Template.main.stats = function(){
	return Session.get("stats");
};
