Template.list.events({
  'change ul li [type=checkbox]': function (event) {
    var $target = $(event.target),
        id = $target.attr('name'),
        done = $target.is(':checked');

    Tasks.update({_id: id}, {$set: {done: done}});
  }
});

Template.list.tasks = Tasks.find();