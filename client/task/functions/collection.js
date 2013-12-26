// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var tasks,
      tagId = Session.get('tagId') || '';

  tasks = Tasks.find(
  {
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    }
  },
  {
    sort: {
      date: -1
      //difficulty:-1
    }
  }).fetch();

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return tasks;
};
