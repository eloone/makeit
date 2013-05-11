// Exports tasks list
Template.suggestions.tasks = function () {
  if (! Meteor.user())
    return ;

  var tasks_short_liked = [];
  var tasks_long_liked = [];
  var tasks_short_disliked = [];
  var tasks_long_disliked = [];
  var tasks_suggested = [];

  Tasks.find({user: Meteor.user()._id, done: false}).forEach(function (task) {
    if (task.difficulty == 1 && task.satisfaction == 1) {
      tasks_short_disliked.push({text: task.text});
    }
    else if (task.difficulty > 1 && task.satisfaction == 1) {
      tasks_long_disliked.push({text: task.text});
    }
    else if (task.difficulty == 1 && task.satisfaction > 1) {
      tasks_short_liked.push({text: task.text});
    }
    else {
      tasks_long_liked.push({text: task.text});
    }
  });

  // Return the first element of the disliked short tasks
  if (tasks_short_disliked.length !== 0) {
    tasks_suggested.push(tasks_short_disliked[0]);
  }

  // Return the first element of the long liked tasks
  if (tasks_long_liked.length !== 0) {
    tasks_suggested.push(tasks_long_liked[0]);
  }

  // Return the first element of the disliked long tasks
  if (tasks_long_disliked.length !== 0) {
    tasks_suggested.push(tasks_long_disliked[0]);
  }
  
  // Return the first element of the short liked tasks
  if (tasks_short_liked.length !== 0) {
    tasks_suggested.push(tasks_short_liked[0]);
  }

  return tasks_suggested;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
// var function shuffle(o){
//     for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//     return o;
// };