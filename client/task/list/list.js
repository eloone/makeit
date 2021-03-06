//Returns suggested tasks
/*getSuggestedTasks = function(){
    if (! Meteor.user())
    return ;

  var tasks_short_liked = [];
  var tasks_long_liked = [];
  var tasks_short_disliked = [];
  var tasks_long_disliked = [];
  var tasks_suggested = [];

  Tasks.find({user: Meteor.user()._id, done: false}).forEach(function (task) {
    if (task.difficulty === 1 && task.satisfaction === 1) {
      tasks_short_disliked.push({text: task.text, _id : task._id});
    }
    else if (task.difficulty > 1 && task.satisfaction === 1) {
      tasks_long_disliked.push({text: task.text, _id : task._id});
    }
    else if (task.difficulty === 1 && task.satisfaction > 1) {
      tasks_short_liked.push({text: task.text, _id : task._id});
    }
    else {
      tasks_long_liked.push({text: task.text, _id : task._id});
    }
  });

  // Return the first element of the short liked tasks
  if (tasks_short_liked.length !== 0) {
    tasks_suggested.push(tasks_short_liked[0]);
  }

  // Return the first element of the long liked tasks
  if (tasks_long_liked.length !== 0) {
    tasks_suggested.push(tasks_long_liked[0]);
  }

  // Return the first element of the disliked short tasks
  if (tasks_short_disliked.length !== 0) {
    tasks_suggested.push(tasks_short_disliked[0]);
  }

  // Return the first element of the disliked long tasks
  if (tasks_long_disliked.length !== 0) {
    tasks_suggested.push(tasks_long_disliked[0]);
  }

  return tasks_suggested;
};*/

// Exports tasks list
Template['task-list'].tasks = function () {
  return getTasks(false);
};

// Exports done-tasks list
Template['task-list'].doneTasks = function () {
  return getTasks(true);
};

Template['task-list'].printTags = function(tagIds, options){
  var ret = '';
  
  var tags = Tags.find(
    {
      _id : {
        $in : tagIds,
        $nin : [Session.get('tagId'), Session.get('alltagId')]
      }
    }).fetch();

  _.each(tags, function(tag){
    //we replace every space between words by - to render as it was first typed
    ret = ret + options.fn({
      label : tag.label.replace(/([^\s])(\s)([^\s])/g, '$1-$3'),
      alias : tag.alias
    });
  });

  return ret;
};

Template['task-list'].for = For;

Template['task-list'].printSatisfaction = function(count){

  switch(count){
      case 1:
        return 'nice';
      case 2:
        return 'great';
      case 3:
        return 'i love it!';
    }

};

Template['task-list'].printDifficulty = function(count){

  switch(count){
      case 1:
        return 'easy';
      case 2:
        return 'feasible';
      case 3:
        return 'a real challenge!';
    }

};


Template['task-list'].events({
  'click .togglecheck': function (event) {
    var $target = $(event.target),//img
        $currentTarget = $(event.currentTarget),//.check/.uncheck
        $strike = $(event.target).siblings('.strike'),
        $line = $currentTarget.parents('.task');

    if ($target.is('a')) {
      event.preventDefault();
      window.open($target.attr('href'));
      return false;
    }

    var task = Tasks.findOne({_id: $line.data('id')});

    Meteor.call('toggleDone', 
    {
      _id : task._id,
      done : !task.done
    }, function(err, res){
      if(res){
        checkReward($line.data('id'));
      }
    });

  },
  'click .tag' : function(event){
    //event.preventDefault();
  },
  'click .editable, .editable .cursor' : function(event){
     var $target = $(event.target),
        $currentTarget = $(event.currentTarget),
        originalCnt = $currentTarget.html(),
        original = $currentTarget.siblings('.original').html(),
        tmp = $currentTarget.siblings('.tmp').html();

        //if we don't click on tag
        if(!$target.is('a')){

          $currentTarget.attr('contenteditable', true);

          $currentTarget.focus();

          if(!$currentTarget.hasClass('typing')){
            if(tmp.trim() != '' && tmp != originalCnt){
              $currentTarget.html(tmp);
            }else{         
              $currentTarget.find('.cursor.satisfaction').replaceWith('&#xf004;&nbsp;');
              $currentTarget.find('.cursor.difficulty').replaceWith('&#xf0e7;&nbsp;');
              $currentTarget.find('.tag').each(function(){
                var itsContent = $(this).text();
                $(this).replaceWith(itsContent);
              });
            }
          }

          if(original.trim() == ''){
              $currentTarget.siblings('.original').html(originalCnt);
          }

          if(Session.get('display_indications') !== false){
            $('.indications').css('visibility', 'visible');
          }else{
            $('.indications').css('visibility', 'hidden');
          }
      }
        
  },
  'mousedown .indications .validation' : function(event){
    var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

        $currentTarget.parents('.indications').find('.init').hide();
        $currentTarget.parents('.indications').find('.response').css('display', 'inline-block');

        Session.set('display_indications', false);
       
  },
  'blur .editable' : function(event){
      var $target = $(event.target),
        $currentTarget = $(event.currentTarget),
        original = $currentTarget.siblings('.original').html(),
        tmp = $currentTarget.html();

      $currentTarget.attr('contenteditable', false)
                    .removeClass('typing')
                    .html(original)
                    .siblings('.tmp').html(tmp);

      if(Session.get('display_indications') !== false ){
        $('.indications').css('visibility', 'hidden');
      }

  },
  'keyup .editable' : function(event){
    var $target = $(event.target),
        $currentTarget = $(event.currentTarget),
        $original = $currentTarget.siblings('.original'),
        $tmp = $currentTarget.siblings('.tmp'),
        original = $original.html(),
        tmp = $tmp.html(),
        $line = $currentTarget.parent('.task'),
        encodedTxt = encodeURIComponent($currentTarget.html()),     
        cursors = {};
        
        $target.focus();

        difficulty = getCountChar('%EF%83%A7', encodedTxt);
        satisfaction = getCountChar('%EF%80%84', encodedTxt);
        
        $currentTarget.addClass('typing');

        //adds hearts and bolts while editing
        cursors = editTask(satisfaction, difficulty, event);

        //cancels edits by typing Esc
        if(event.keyCode == 27){
          $currentTarget.html(original)
                        .blur();
          $tmp.html('');
        }

        encodedTxt = encodeURIComponent($currentTarget.html());

        //saves task by typing Enter
        if(event.keyCode == 13){
          
          var task = Tasks.findOne({_id: $line.data('id')}),
              rawTxt = getRawText(encodedTxt),
              //we don't save symbols in DB just text
              toSave = {
                done : $line.hasClass('done'),
                text : rawTxt,
                satisfaction : satisfaction,
                difficulty : difficulty
              },
              session = {
                tagId : Session.get('tagId'),
                alltagId : Session.get('alltagId')
              };

          if(rawTxt == ''){
            //if no text + save = we delete the task
            Meteor.call('removeTask', {_id : $line.data('id')});

          }else{
            // Save task 
            Meteor.call('updateTask', {_id : $line.data('id'), set : toSave}, session);
          }
        }
  }
});