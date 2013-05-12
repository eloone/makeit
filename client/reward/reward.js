// Check if the user has won a reward
checkReward = function (tags) {
  tags = getTags(tags);

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
        return Template['reward-roma']();
      case 'family':
        return Template['reward-family']();
    }
  });

  document.body.appendChild(modal);
  $('.modal')
  .on('hidden', function () {
    $(this).remove();
  })
  .modal();
};