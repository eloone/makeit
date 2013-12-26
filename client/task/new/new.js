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
        //tags = extractHashTags(text),
        encodedTxt = encodeURIComponent(text),
        cursors= {};

    $target.addClass('typing');

    if(event.keyCode == 27){
      $target.text('')
             .blur();
    }

    //Set suggestions
    //Session.set('suggestions', getSuggestions(tags));

    // Active task-creator
    $('.task-creator').toggleClass('active', !! text);

    starCount = getCountChar('%EF%83%A7', encodedTxt);

    plusCount = getCountChar('%EF%80%84', encodedTxt);
    
    //adds hearts and bolts while editing
    cursors = editTask(plusCount, starCount, event);

    var rawTxt = getRawText(encodedTxt);
    // After we type enter || no text to save
    if (event.keyCode !== 13 || rawTxt == '') // 13 = enter
      return true;

    // Detect smart-task
    task = detectSmartTask({
      text: rawTxt,
      satisfaction: plusCount,
      difficulty: starCount
    });

    // Insert task
    Meteor.call('addTask', task, {tagId : Session.get('tagId'), alltagId : Session.get('alltagId')});
    
    // Clear input
    $target.html('');

  }

});

// Add a smart task
detectSmartTask = function (task) {
  if (task.text.match(/call.*06/i)) {
    var phone = task.text.match(/06[\s\d]+/);
    task.info = '<a class="btn btn-mini" href="tel:' + phone + '">Call ' + phone + '</a>';
  }

  return task;
};
