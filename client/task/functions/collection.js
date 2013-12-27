// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var tasks,
      tagId = Session.get('tagId') || '',
      tasksWithTag,
      result = [];

  tasksWithTag = Tasks.find({
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.tags.length > 1"
  },
  {
    sort : {
      date : -1
    }
  }).fetch();

  tasks = Tasks.find(
  {
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.tags.length <= 1"
  },
  {
    sort: {
      date: -1,
      //difficulty:-1
    }
  }).fetch();

  result = tasksWithTag.concat(tasks);

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return result;
};
