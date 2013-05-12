Template.navbar.avatar = function () {
  getFacebookPicture();
  return Session.get('avatar');
};

Template.navbar.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
  }
});