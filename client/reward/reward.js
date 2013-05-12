// Check if the user has won a reward
checkReward = function () {
  var tags = getTags();

  var tag = _.reduce(tags, function (memo, tag) {
    if (! memo && tag.complete)
      memo = tag;
    return memo;
  }, null);

  if (! tag)
    return ;

  var modal = Meteor.render(function () {
    return Template.reward();
  });

  document.body.appendChild(modal);
  $('.modal').modal();
};