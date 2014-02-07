Meteor.publish('pointsData', function () {
	var userId = this.userId;
	var queryIsOngoing = true;
	var doneTasksObserver = Tasks.find({user : this.userId, done : true}).observe({

		added : function(task){
			var points,
				inc = {};
			
			//do nothing if results are not ready #hackOverCliff !!
			if(queryIsOngoing)
				return;

			var difficultyKey = 'difficulty.level'+task.difficulty;
			var satisfactionKey = 'satisfaction.level'+task.satisfaction;
			points = getPoints(task); 

			inc = {
				done : 1,
				points : points
			};

			inc[difficultyKey] = 1;
			inc[satisfactionKey] = 1;

			var updated = Points.update({user : userId}, {$inc : inc});

		},
		removed : function(task){
			var points,
				inc = {};

			//do nothing if results are not ready #hackOverCliff !!
			if(queryIsOngoing)
				return;

			var difficultyKey = 'difficulty.level'+task.difficulty;
			var satisfactionKey = 'satisfaction.level'+task.satisfaction;
			points = getPoints(task);

			inc = {
				done : -1,
				points : -points
			};

			inc[difficultyKey] = -1;
			inc[satisfactionKey] = -1;

			var updated = Points.update({user : userId}, {$inc : inc}); 

		}
	});

	//this is an unbelievable hack
	queryIsOngoing = false;

	//after observer returns
	this.ready();

	this.onStop(function(){
		doneTasksObserver.stop();
	});

	return Points.find({user : this.userId});
});

//gets Points for a task
getPoints = function(task){
	var difficulty = getCursorPoints(task.difficulty),
		satisfaction = getCursorPoints(task.satisfaction),
		//it worths 30 points to complete a task attached to a goal
		//"all" counts as a tag so we count it out
		tags = task.tags.length > 1 ? 30 : 0 ,
		total = difficulty + satisfaction + tags;

		//if nothing particular for this task 
		//completing it still counts for 1 point
		if(total == 0){
			return 1;
		}

		return total;
};

//gets points from difficulty/satisfaction
getCursorPoints = function(cursor){
	var points = 0;

	switch(cursor){
		case 1 :
			points = 5;
		break;
		
		case 2 :
			points = 10;
		break;

		case 3 :
			points = 20;
		break;
	}

	return points;
};

//gets init data to set Points collection
getPointsData = function(userId){
	var res = {
		difficulty : {
			level0 : 0,
			level1 : 0,
			level2 : 0,
			level3 : 0
		},
		satisfaction : {
			level0 : 0,
			level1 : 0,
			level2 : 0,
			level3 : 0
		},
		done : 0,
		points : 0
	};
console.log('getPointsData');
console.log('userId:');
console.log(userId);

	var tasks = Tasks.find({
		user : userId,
		done : true
	}).fetch();

	if(_.isUndefined(tasks) || _.isEmpty(tasks)){
		return res;
	}

	res.done = tasks.length;

	_.each(tasks, function(task){
		res['difficulty']['level'+task.difficulty]++;
		res['satisfaction']['level'+task.satisfaction]++; 
		res.points += getPoints(task);
	});

	return res;

};
