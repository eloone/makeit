Accounts.loginServiceConfiguration.remove({
    service: 'facebook'
});

Accounts.loginServiceConfiguration.insert({
    service: 'facebook',
    appId  : '118830568318723',
    secret : 'b7c6c1d6c9e59bc56a86caae3f692c76'
});

Meteor.publish('userData', function () {
  return Meteor.users.find();
});


Meteor.methods({
  getAvatar : function () {
    return 'ok';
  }
});