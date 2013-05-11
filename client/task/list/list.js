// Exports tasks list
Template['task-list'].tasks = function () {
  if (! Meteor.user())
    return ;

  var query = {user: Meteor.user()._id};

  if (Session.get('tag'))
    query.tags = Session.get('tag');

  return Tasks.find(query);
};

Template['task-list'].events({
  'change ul li [type=checkbox]': function (event) {
    var $target = $(event.target),
        id = $target.attr('name'),
        done = $target.is(':checked');

    // Update task (done/undone)
    Tasks.update({_id: id}, {$set: {done: done}});

    checkAward();
  }
});