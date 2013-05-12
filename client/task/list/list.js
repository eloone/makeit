// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var query = {
    user: Meteor.user()._id,
    done: done
  };

  if (Session.get('tag'))
    query.tags = Session.get('tag');

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return Tasks.find(query, {sort: {date: -1}});
};

//Returns suggested tasks
getSuggestedTasks = function(){
    if (! Meteor.user())
    return ;

  var tasks_short_liked = [];
  var tasks_long_liked = [];
  var tasks_short_disliked = [];
  var tasks_long_disliked = [];
  var tasks_suggested = [];

  Tasks.find({user: Meteor.user()._id, done: false}).forEach(function (task) {
    if (task.difficulty == 1 && task.satisfaction == 1) {
      tasks_short_disliked.push({text: task.text, _id : task._id});
    }
    else if (task.difficulty > 1 && task.satisfaction == 1) {
      tasks_long_disliked.push({text: task.text, _id : task._id});
    }
    else if (task.difficulty == 1 && task.satisfaction > 1) {
      tasks_short_liked.push({text: task.text, _id : task._id});
    }
    else {
      tasks_long_liked.push({text: task.text, _id : task._id});
    }
  });

  // Return the first element of the short liked tasks
  if (tasks_short_liked.length !== 0) {
    tasks_suggested.push(tasks_short_liked[0]);
  }

  // Return the first element of the long liked tasks
  if (tasks_long_liked.length !== 0) {
    tasks_suggested.push(tasks_long_liked[0]);
  }

  // Return the first element of the disliked short tasks
  if (tasks_short_disliked.length !== 0) {
    tasks_suggested.push(tasks_short_disliked[0]);
  }

  // Return the first element of the disliked long tasks
  if (tasks_long_disliked.length !== 0) {
    tasks_suggested.push(tasks_long_disliked[0]);
  }

  return tasks_suggested;
};

// Exports tasks list
Template['task-list'].tasks = function () {
  return getTasks(false);
};

// Exports done-tasks list
Template['task-list'].doneTasks = function () {
  return getTasks(true);
};

Template['task-list'].events({
  'click li': function (event) {
    var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

    if ($target.is('a')) {
      event.preventDefault();
      window.open($target.attr('href'));
      return false;
    }

    // Update task (done/undone)
    Tasks.update({_id: $currentTarget.data('id')}, {$set: {done: ! $currentTarget.hasClass('done')}});

    checkReward();
  }
});
