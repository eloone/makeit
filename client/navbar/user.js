Template['navbar-user'].avatar = function () {
  getGooglePicture();
  return Session.get('avatar');
};

Template['navbar-user'].score = function () {
 var points = Points.findOne();

 return points;
};

Template['navbar-user'].email = function(){
	if(!Meteor.user())
		return;

	if(!_.isArray(Meteor.user().emails))
		return;

	if(!_.isUndefined(Meteor.user().emails[0].address)){
		return Meteor.user().emails[0].address.replace(/(.*)@(.*)/, '$1');
	}
};