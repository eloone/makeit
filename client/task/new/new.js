tagRegexp = /#([^\s]*)/g;

// Extract hash tags from a text
extractHashTags = function (text) {
  return _.map(text.match(tagRegexp), function (text) {
    return text.replace(/^#/, '');
  });
};

// Remove hash tags from a text
stripHashTags = function (text) {
  return text.replace(tagRegexp, '').trim();
};

// Get cursor score
getCursorScore = function (cursor) {
  return $('[data-type=' + cursor + '] .cursor.checked').length;
};

Template['new-task']['difficulty_tooltip'] = function(){
    return Session.get('difficulty_tooltip');
};

Template['new-task']['likeness_tooltip'] = function(){
    return Session.get('likeness_tooltip');
};

Template['new-task'].events({
  'keyup [name=task]': function (event) {
    if (event.keyCode !== 13) // 13 = enter
      return true;

    var $target = $(event.target),
        text = $target.val();

    // Insert task
    Tasks.insert({
      user: Meteor.user()._id,
      text: stripHashTags(text),
      tags: extractHashTags(text),
      satisfaction: getCursorScore('satisfaction'),
      difficulty: getCursorScore('difficulty'),
      done: false
    });

    // Clear input
    $target.val('');
    //Clear cursors
    $('.task-creator .cursor').removeClass('checked');
    
  },

  'click .cursor': function (event) {
    var $target = $(event.target);
    if($('input[name="task"]').val() != ''){
        $target.prevAll().andSelf().addClass('checked');
        $target.nextAll().removeClass('checked');
    }
  },
  'mouseleave .trigger': function(event){
    var $target = $(event.target);
    $target.siblings().andSelf().removeClass('hover'); 
    Session.set('difficulty_tooltip', null);
    Session.set('likeness_tooltip', null);
  },
  'mouseenter .trigger' : function(event){
    var $target = $(event.target);
    if($('input[name="task"]').val() != ''){
        $target.prevAll().andSelf().addClass('hover');
        $target.nextAll().removeClass('hover');
        $target.css('cursor', 'pointer');
        
        if($target.hasClass('cursor')){
            if($target.hasClass('icon-heart')){
                Session.set('likeness_tooltip', $target.data('title'));
            }
            else{
                Session.set('likeness_tooltip', null);
            }
             if($target.hasClass('icon-bolt')){
                Session.set('difficulty_tooltip', $target.data('title'));
            }
            else{
                Session.set('difficulty_tooltip', null);
            }
        }
        
    }
    else{
        $target.css('cursor', 'default');
        Session.set('difficulty_tooltip', null);
        Session.set('likeness_tooltip', null);
    }
  }
  
});