Template['user-infos'].avatar = function () {
  getFacebookPicture();
  return Session.get('avatar');
};

Template['user-infos'].events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
  }
});