Template.navbar.avatar = function () {
  getFacebookPicture();
  return Session.get('avatar');
};

Template.navbar.tag = function(){
  return Session.get('tag') || 'All';
};

Template.navbar.count_done = function(){
  var tasks = getTasks(true);

  return tasks.count();
};

Template.navbar.points = function(){
  var tasks = getTasks(true),
      points = 0;

  tasks.forEach(function (task) {
    points += task.satisfaction + task.difficulty;

  });
  
  return points;
};

Template.navbar.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
  }
});
