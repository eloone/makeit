getGooglePicture = function () {
  if (! Meteor.user() || ! Meteor.user().services)
    return ;
  if(typeof Meteor.user().services.google != 'undefined'){
    Session.set('avatar',  Meteor.user().services.google.picture);
  }
};