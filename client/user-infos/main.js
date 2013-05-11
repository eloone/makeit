Template['user-infos'].events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
  }
});