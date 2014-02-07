// Check if the user has won a reward
/*checkReward = function (tags) {
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
      default:
        return Template['reward-default']();
    }
  });

  document.body.appendChild(modal);
  $('.modal')
  .on('hidden', function () {
    $(this).remove();
  })
  .modal();
};*/

checkReward = function(taskId){
  //task always belongs to tag "all" by default
  var tagId = Session.get('tagId');
  var task = Tasks.findOne({_id : taskId, done : true});

  var tag = Tags.findOne({_id : Session.get('tagId')});

  var formatted = formatTags(tag);

  var key = '';

  if(tag.complete){
    key += 'goal_complete'
  }

  if(_.isUndefined(task) || _.isEmpty(task)){
    Session.set('reward', key);
    return;
  }

  if(task.difficulty == 3 && task.satisfaction == 3){
    if(key != ''){
      key += '_';
    }

    key +='challenge_blast';
  }else{
    if(task.difficulty == 3){
       if(key != ''){
        key += '_';
       }
      
      key += 'challenge';
    }
    if(task.satisfaction == 3){
      if(key != ''){
        key += '_';
       }

      key += 'blast';
    }
  }

  if(key == ''){
    key = 'done';
  }

  Session.set('reward', key);

}