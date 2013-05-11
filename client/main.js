var Tasks = new Meteor.Collection("tasks");

Template.create.events({
  'keyup [name=task]': function (event) {
    if (event.keyCode !== 13) // 13 = enter
      return true;

    Tasks.insert({
      text: $(event.target).val()
    });
  }
});