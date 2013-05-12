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

// Get suggestions from a tag
getSuggestions = function (tags) {
  var suggestions = [];

  _.each(tags, function (tag) {
    var tasks = [],
        text;

    switch(tag.toLowerCase()) {
      case 'roma':
      text = 'Oh you are going to Roma ? Here are some things you might want to check:';
      tasks = tasks.concat([
        'Buy tickets',
        'Booking Hotel',
        'Prepare visits'
        ]);
    }

    // Append tag
    tasks = _.map(tasks, function (suggestion) {
      return suggestion + ' #' + tag;
    });

    if (text)
      suggestions.push({
        text: text,
        tasks: tasks
      });
  });

  return suggestions;
};

addTask = function (options) {
  Tasks.insert(_.extend({
    date: new Date(),
    user: Meteor.user()._id,
    tags: extractHashTags(options.text),
    satisfaction: 0,
    difficulty: 0,
    done: false
  }, options, {
    text: stripHashTags(options.text)
  }));
};


Template['new-task'].difficulty_tooltip = function(){
    return Session.get('difficulty_tooltip');
};

Template['new-task'].likeness_tooltip = function(){
    return Session.get('likeness_tooltip');
};

Template['new-task'].suggestions = function () {
  return Session.get('suggestions');
};

Template['new-task'].events({
  'keyup [name=task]': function (event) {
    var $target = $(event.target),
        text = $target.val(),
        tags = extractHashTags(text);

    //Set suggestions
    Session.set('suggestions', getSuggestions(tags));

    // After we click on enter
    if (event.keyCode !== 13) // 13 = enter
      return true;

    // Insert task
    addTask({
      text: text,
      satisfaction: getCursorScore('satisfaction'),
      difficulty: getCursorScore('difficulty')
    });

    // Clear input
    $target.val('');

    //Clear cursors
    $('.task-creator .cursor').removeClass('checked');
  },

  'click .cursor': function (event) {
    if(! $('input[name="task"]').val())
      return ;

    $(event.target)
    .prevAll().andSelf().addClass('checked')
    .end().nextAll().removeClass('checked');
  },

  'click .task-list li': function (event) {
    var $target = $(event.currentTarget);
    addTask({text: $target.data('text')});
    $target.addClass('added').fadeOut();

    // Remove if no more suggestions
    if (! $target.parents('ul').find('li').not('.added').length)
      Session.set('suggestions', null);
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