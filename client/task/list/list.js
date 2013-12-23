// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var query = {
    user: Meteor.user()._id,
    done: done
  };

  if (Session.get('tag'))
    query.tags = Session.get('tag');

  if(Session.get('tag') == 'all')
    delete query.tags;

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return Tasks.find(query, {sort: {date: -1}});
};

countTasks = function(done){
  if (! Meteor.user())
    return ;

  var query = {
    user: Meteor.user()._id,
    done: done
  };

  if (Session.get('tag'))
    query.tags = Session.get('tag');

  if(Session.get('tag') == 'all')
    delete query.tags;

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return Tasks.find(query, {sort: {date: -1}}).count();
};

getTotalTasks = function(){
  if (! Meteor.user())
    return ;

  var query = {
    user: Meteor.user()._id
  };

  return Tasks.find(query, {sort: {date: -1}}).count();

};

getProgress = function(){
  var count = countTasks(true);
  var total = getTotalTasks();

  return (count*100)/total;
};

//Returns suggested tasks
getSuggestedTasks = function(){
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
};

// Exports tasks list
Template['task-list'].tasks = function () {
  return getTasks(false);
};

// Exports done-tasks list
Template['task-list'].doneTasks = function () {
  return getTasks(true);
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

    // Update task (done/undone)
    Tasks.update({_id: $line.data('id')}, {$set: {done: ! $line.hasClass('done')}}, function(){
     
        $('#_'+$line.data('id')+'.done .strike').css({width : '100%'});

    });

    //checkReward(task.tags);
  },
  'click .editable, .editable .cursor' : function(event){
     var $target = $(event.target),
        $currentTarget = $(event.currentTarget),
        originalCnt = $currentTarget.html(),
        original = $currentTarget.siblings('.original').html(),
        tmp = $currentTarget.siblings('.tmp').html();

        $currentTarget.attr('contenteditable', true);

        $currentTarget.focus();

        if(!$currentTarget.hasClass('typing')){
          if(tmp.trim() != '' && tmp != originalCnt){
            $currentTarget.html(tmp);
          }else{         
            $currentTarget.find('.cursor.satisfaction').replaceWith('&#xf004;&nbsp;');
            $currentTarget.find('.cursor.difficulty').replaceWith('&#xf0e7;&nbsp;');
          }
        }

        if(original.trim() == ''){
            $currentTarget.siblings('.original').html(originalCnt);
        }
console.log(Session.get('display_indications'));
        if(Session.get('display_indications') !== false){
          $('.indications').css('visibility', 'visible');
        }else{
          $('.indications').css('visibility', 'hidden');
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
  'keyup .task' : function(event){
    var $target = $(event.target),//li
        $currentTarget = $(event.currentTarget);

        $currentTarget.addClass('typing');
  }
});

Template['task-list'].for = function(count, options) {
  var ret = "";

  for(var i=0, j=count; i<j; i++) {
    ret = ret + options.fn({count : count});
  }

  return ret;
};

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
