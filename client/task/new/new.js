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
        encodedTxt = encodeURIComponent(text);

    $target.addClass('typing');

    //Set suggestions
    Session.set('suggestions', getSuggestions(tags));

    // Active task-creator
    $('.task-creator').toggleClass('active', !! text);

    starCount = getCountChar('%EF%83%A7', encodedTxt);

    plusCount = getCountChar('%EF%80%84', encodedTxt);

    //replaces * by bolts
    if (event.keyCode == 56 || event.keyCode == 106){// * sign
      if(starCount < 3){
        if(/\*$/.test(text)){
            starCount++;
            var html = $target.html();
            html = html.replace(/\*$/, '');
            $target.html(html+'&#xf0e7;&nbsp;');      
            setEndOfContenteditable($target.get(0));
            $target.focus();
        }
      }
    }

    //replaces + by hearts
    if (event.keyCode == 107 || event.keyCode == 187){// + sign
      if(plusCount < 3){
        if(/\+$/.test(text)){
            plusCount++;
            var html = $target.html();
            html = html.replace(/\+$/, '');
            $target.html(html+'&#xf004;&nbsp;');      
            setEndOfContenteditable($target.get(0));
            $target.focus();
        }
      }
    }

    switch(starCount){
      case 1:
        $target.find('.fa-bolt').attr('title', 'easy');
        break;
      case 2:
        $target.find('.fa-bolt').attr('title', 'feasible');
        break;
      case 3:
        $target.find('.fa-bolt').attr('title', 'a real challenge!');
        break;
    }

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

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

function getCountChar(char, inStr){
  return (inStr.split(char).length - 1);
}