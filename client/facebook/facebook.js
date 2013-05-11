getFacebookPicture = function () {
  if (! Meteor.user() || ! Meteor.user().services)
    return ;

  Meteor.http.get('https://graph.facebook.com/me', {
    params: {
      access_token: Meteor.user().services.facebook.accessToken,
      fields: 'picture'
    }
  }, function (err, result) {
    Session.set('avatar', result.data.picture.data.url);
  });
};