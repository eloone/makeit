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

Template['task-list'].suggested = function(){
   var suggested_tasks = getSuggestedTasks();
   if(suggested_tasks.length){
       return {tasks : suggested_tasks};
   }
   
   return null;
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
    var $target = $(event.currentTarget);

    // Update task (done/undone)
    Tasks.update({_id: $target.data('id')}, {$set: {done: ! $target.hasClass('done')}});

    checkAward();
  }
});
