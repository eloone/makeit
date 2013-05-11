Meteor.startup(function () {
  Backbone.history.start();
});

Meteor.subscribe('userData');