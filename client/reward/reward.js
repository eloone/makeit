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
    switch(tag.text.toLowerCase()){
      case 'roma':
        return Template.reward_roma();
      case 'family':
        return Template.reward_family()
    }
  });

  document.body.appendChild(modal);
  $('.modal').modal();
};