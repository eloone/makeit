// Login to website
login = function () {
  Meteor.loginWithFacebook({
    requestPermissions: ['email']
  }, function (err) {
    if (err)
      Session.set('errorMessage', err.reason || 'Unknown error');
  });
};

Template.login.events({
  'click button': login
});