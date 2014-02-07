
//You can add a task 1. from a tag page 2. from the all page
addTask = function (options, session) {
  var tagId = session.tagId,
      alltagId = session.alltagId || null,
      hashtags = extractHashTags(options.text),
      task = options,
      taskTags =[];

      //we don't allow overriding of tags
      if(!_.isUndefined(options.tags))
      	delete options.tags;

      if(_.isUndefined(tagId)){
        console.log('Cannot add task without a current tagId');
        return;
      }

      //first we add task
      //returns inserted id
	  var insertedId = Tasks.insert(
	  	_.extend({
		    date: new Date(),
		    user: Meteor.user()._id,
		    tags: [],
		    satisfaction: 0,
		    difficulty: 0,
		    done: false
	  	}, 
	  		options, 
	  	{
	    	text: stripHashTags(options.text)
	  	})
	  );

	  //if task is not inserted no need to continue
	  if(!insertedId){
	  	console.log('Task was not inserted');
	  	return;
	  }

    //we add tags present in hashtags[]
    taskTags = addHashtags(hashtags, taskTags, tagId, alltagId);

    if(_.isEmpty(taskTags)){
      taskTags = getFamilyIds(tagId);
    }

    //we remove duplicates here although $addToSet removes duplicates too
    taskTags = _.uniq(taskTags);

    //Finally we attach all the tags to the task
    //Current tag + its parents + hashtags + its parents
   Tasks.update({_id : insertedId}, { $addToSet : {tags : {$each : taskTags} }});
};

//Returns array of tag ids to be added to task
addHashtags = function(hashtags, taskTags, tagId, alltagId){
  if(_.isUndefined(taskTags)){
    var taskTags = [];
  }

  if(!_.isEmpty(hashtags)){
      _.each(hashtags, function(tag){

        var aliasForm = getAlias(tag);
        var existingTag = Tags.findOne({alias : aliasForm});

          //this tag does not exist yet let's create it
          if(_.isEmpty(existingTag)){
           var newTagId =  addTag({               
              label : getLabelFromHash(tag),
              parent : tagId || alltagId,
              user : Meteor.user()._id
            });

           if(newTagId){
            //taskTags will contain duplicates at this point
            taskTags = taskTags.concat(getFamilyIds(newTagId));
           }
          }else{
            taskTags = taskTags.concat(getFamilyIds(existingTag._id));
          }
      });
    }

    return taskTags;
};

//returns number of removed elements
removeTask = function(task){
	if(_.isUndefined(task._id)){
		console.log('Missing id to remove task');
		return;
  }

	var removed = Tasks.remove({_id: task._id});
	
  return removed;
};

//Toggle the done status status of task
//Returns nb of updated rows
toggleDone = function(task){
  if(_.isUndefined(task._id)){
    console.log('Missing id to update task');
    return;
  }

  if(_.isUndefined(task.done)){
    console.log('Missing done status to update task');
    return;
  }

  var updated = Tasks.update({_id: task._id}, {$set: {done : task.done}});

  return updated;
};

//Updates a task with set 
//Returns nb of updated rows
updateTask = function(task, session){
  var tagId = session.tagId,
      alltagId = session.alltagId || null;

	if(_.isUndefined(task._id)){
		console.log('Missing id to update task');
		return;
	}

	if(_.isUndefined(task.set)){
		console.log('Missing data to set to update task');
		return;
	}

  var toUpdate = Tasks.findOne({_id : task._id});

  var hashtags = extractHashTags(task.set.text),
      taskTags = addHashtags(hashtags, [], tagId, alltagId),
      toSet = {};

      taskTags = _.uniq(taskTags);

      //if no hashtags or all tag not present don't forget to always put the alltag id by default
      if(_.isEmpty(taskTags) || _.indexOf(taskTags, alltagId) == -1){
        taskTags = [alltagId];
        if(_.indexOf(taskTags, tagId) && tagId != alltagId){
          taskTags.push(tagId);
        }
      }

      toSet = _.extend(task.set, {
        tags : taskTags,
        text : stripHashTags(task.set.text)
      });

	var updated = Tasks.update({ _id: task._id }, { $set: toSet });

  return updated;
};

//Returns the ids of the tags to be attached to task
//current tag + all its parents
getFamilyIds = function(tagId){
  var ids = [];

  function retrieveIds(id){
    var tag = Tags.findOne({_id : id});
    ids.push(id);

    if(tag.parent){
      retrieveIds(tag.parent);
    }
  }

  retrieveIds(tagId);

  return ids;
};

// Add a smart task
detectSmartTask = function (task) {
  if (task.text.match(/call.*06/i)) {
    var phone = task.text.match(/06[\s\d]+/);
    task.info = '<a class="btn btn-mini" href="tel:' + phone + '">Call ' + phone + '</a>';
  }

  return task;
};

tagRegexp = /#([^\s]*)/g;

// Extract hash tags from a text
// Returns an array with the tags
extractHashTags = function (text) {
  return _.map(text.match(tagRegexp), function (text) {
    return text.replace(/^#/, '');
  });
};

// Remove hash tags from a text
stripHashTags = function (text) {
  return text.replace(tagRegexp, '').trim();
};

getLabelFromHash = function(hashtag){
  var label = hashtag.replace(/-+/g, ' ');

  return label;
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
