Template.list.events({
  'change ul li [type=checkbox]': function (event) {
    var $target = $(event.target),
        id = $target.attr('name'),
        done = $target.is(':checked');

    // Update task (done/undone)
    Tasks.update({_id: id}, {$set: {done: done}});
  }
});

// Exports tasks list
Template.list.tasks = Tasks.find();