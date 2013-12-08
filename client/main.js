Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Meteor.subscribe('userData');

Template.main.page404 = function(){
	return Session.get('page404');
}