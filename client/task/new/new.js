tagRegexp = /#([^\s]*)/g;
var starCount = 0;
var plusCount = 0;
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
          {
            text: 'Buy tickets',
            difficulty: 1,
            satisfaction: 1,
            info: '<a class="btn btn-mini" href="http://www.easyjet.com/"><i class="icon-plane"></i> Book your flight with EasyJet.com</a>'
          },
          {
            text: 'Booking hotel',
            difficulty: 2,
            satisfaction: 2,
            info: '<a class="btn btn-mini" href="http://www.hotels.com/"><i class="icon-briefcase"></i> Book your hotel with Hotels.com</a>'
          },
          {
            text: 'Prepare visits',
            difficulty: 3,
            satisfaction: 2,
            info: '<a class="btn btn-mini" href="http://goo.gl/maps/kiK6P"><i class="icon-map-marker"></i> Explore on Google Map</a>'
          }
        ]);
    }

    // Append tag
    tasks = _.map(tasks, function (task) {
      task.text = task.text + ' #' + tag;
      return task;
    });

    if (text)
      suggestions.push({
        text: text,
        tasks: tasks
      });
  });

  return suggestions;
};

// Add a task
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

// Add a smart task
detectSmartTask = function (task) {
  if (task.text.match(/call.*06/i)) {
    var phone = task.text.match(/06[\s\d]+/);
    task.info = '<a class="btn btn-mini" href="tel:' + phone + '">Call ' + phone + '</a>';
  }

  return task;
};

Template['new-task'].suggestions = function () {
  return Session.get('suggestions');
};

Template['new-task'].events({
  //new version added
  'focus .input' : function(event){
    var $target = $(event.target);

    if($target.text().trim() == $('.placeholder').text().trim()){
       $target.text('');
    }
   
  },
  'blur .input' : function(event){
    var $target = $(event.target);

    if($target.text() == ''){
      $target.removeClass('typing');
      $target.text($('.placeholder').text());
    }

  },
  'keyup .input': function (event) {
    var $target = $(event.target),
        text = $target.html(),
        tags = extractHashTags(text),
        encodedTxt = encodeURIComponent(text),
        cursors= {};

    $target.addClass('typing');

    //Set suggestions
    Session.set('suggestions', getSuggestions(tags));

    // Active task-creator
    $('.task-creator').toggleClass('active', !! text);

    starCount = getCountChar('%EF%83%A7', encodedTxt);

    plusCount = getCountChar('%EF%80%84', encodedTxt);
    
    //adds hearts and bolts while editing
    cursors = editTask(plusCount, starCount, event);

    // After we type enter
    if (event.keyCode !== 13) // 13 = enter
      return true;

    // Detect smart-task
    task = detectSmartTask({
      text: $target.text(),
      satisfaction: plusCount,
      difficulty: starCount
    });

    // Insert task
    addTask(task);

    // Clear input
    $target.html('');

  },

  'click .cursor': function (event) {
    $(event.target).prevAll().andSelf().addClass('checked');
    $(event.target).nextAll().removeClass('checked');
  },

  'click .task-list li': function (event) {
    var $target = $(event.currentTarget);
    addTask({
      text: $target.data('text'),
      difficulty: $target.data('difficulty'),
      satisfaction: $target.data('satisfaction'),
      info: $target.find('[name=info]').html()
    });

    $target.addClass('added').fadeOut();

    // Remove if no more suggestions
    if (! $target.parents('ul').find('li').not('.added').length)
      Session.set('suggestions', null);
  }

});
