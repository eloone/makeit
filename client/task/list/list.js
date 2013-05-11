// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var query = {user: Meteor.user()._id, done: done};

  if (Session.get('tag'))
    query.tags = Session.get('tag');

  return Tasks.find(query);
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