Template['user-stats'].score = function () {
  var points = Points.findOne();
  return points;
};

Template['user-stats'].for = For;