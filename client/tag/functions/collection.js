// Return tag list with more data
// tags = [] result of db query
formatTags = function (tags) {
	
	if(_.isUndefined(tags)){
		console.log('DB could not retrieve tags');

		return;
	}

	if(!_.isArray(tags)){
		tags = [tags];
	}

	_.each(tags, function(tag){

		if(_.isUndefined(tag) || _.isUndefined(tag._id)){
			console.log('DB could not retrieve tag');
			return;
		}

		var cursors = getCursors(tag._id);

		tag.total = getTotal(tag._id);
		tag.done = getCountDone(tag._id);
		tag.left = tag.total - tag.done;
		tag.progress = tag.done == 0 || tag.total == 0 ? 0 : Math.round(tag.done * 100 / tag.total);
		tag.complete = tag.total === tag.done;
		tag.difficulty = cursors.difficulty;
		tag.satisfaction = cursors.satisfaction;
	});

  // Sort tags by progress in asc order
  tags = _.sortBy(tags, function (tag) {
    return tag.progress;
  });

  //we sort in desc order
  tags = tags.reverse();

  return tags;
};

getTotal = function(id){
	var total = Tasks.find({tags : {$in : [id]}}).count();

	return total;
};

getCountDone = function(id){
	var done = Tasks.find({tags : {$in : [id]},  done : true}).count();
	
	return done;
};

getCursors = function(id){
	var tasks = Tasks.find({tags : {$in : [id]}}).fetch(),
		difficulty = 0,
		satisfaction = 0;

	_.each(tasks, function(task){
		difficulty += task.difficulty;
		satisfaction += task.satisfaction;
	});

	return {
		difficulty : difficulty,
		satisfaction : satisfaction
	};

};