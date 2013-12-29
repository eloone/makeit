Template['navbar-user'].avatar = function () {
  getGooglePicture();
  return Session.get('avatar');
};

Template['navbar-user'].points = function () {
 var points = Points.findOne();

 return points;
};