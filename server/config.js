/*Accounts.loginServiceConfiguration.remove({
    service: 'facebook'
});

Accounts.loginServiceConfiguration.insert({
    service: 'facebook',
    appId  : '118830568318723',
    secret : 'b7c6c1d6c9e59bc56a86caae3f692c76'
});*/

Accounts.loginServiceConfiguration.remove({
    service: 'google'
});

Accounts.loginServiceConfiguration.insert({
    service: 'google',
    clientId  : '338173709823',
    secret : '0nHm7G7tSjlKa1hZVGRKeysN'
});

Meteor.publish('userData', function () {
  return Meteor.users.find();
});

Meteor.publish('tagData', function () {
  return Tags.find({user : this.userId });
});
