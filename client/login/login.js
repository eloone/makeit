Template.login.events({
  'click a': function (event) {
    event.preventDefault();

    Meteor.loginWithFacebook({}, function (err) {
      if (err)
        Session.set('errorMessage', err.reason || 'Unknown error');
    });
  }
});