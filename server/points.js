Meteor.publish('pointsData', function () {
	var userId = this.userId;
	var queryIsOngoing = true;
	var doneTasksObserver = Tasks.find({user : this.userId, done : true}).observe({
		/*
			Attention please:

			for some unknown cryptic reason the following callbacks are called twice when the result set of the query above
			changes - and only in production !!
			so to work around this and prevent any further suicidal attempts we track the tasks that were already treated in
			the added and removed callbacks in the Points.tasksCounted ppty and we apply the callback only if the task was not treated yet			

		*/
		added : function(task){

			var userPoints = Points.findOne({user : userId});

			//do nothing if results are not ready #hackOverCliff !!
			if(queryIsOngoing){
				return;
			}

			if(_.isUndefined(userPoints.tasksCounted)){
				return;
			}

			//if task id is present in the Points.tasksCounted array
			//it means when it was added to the result set it has already been taken into account to count its points
			//so we shouldn't count it again
			var alreadyUpdated = userPoints.tasksCounted.indexOf(task._id) > -1;

			if(alreadyUpdated == false){
				shameHack(task);
			}	

			function shameHack(task){
				var points,
					inc = {},
					difficultyKey = 'difficulty.level'+task.difficulty,
					satisfactionKey = 'satisfaction.level'+task.satisfaction;

				//gets the total points for task
				points = getPoints(task); 

				inc = {
					done : 1,
					points : points
				};

				inc[difficultyKey] = 1;
				inc[satisfactionKey] = 1;

				var updated = Points.update({user : userId}, {$inc : inc, $addToSet : {tasksCounted : task._id}});

			}			

		},
		removed : function(task){

			var userPoints = Points.findOne({user : userId});

			//do nothing if results are not ready #hackOverCliff !!
			if(queryIsOngoing){
				return;
			}

			if(_.isUndefined(userPoints.tasksCounted)){
				return;
			}

			//if task is not present in Points then it means it has already been removed 
			//and taken into account to count the points
			var alreadyUpdated = userPoints.tasksCounted.indexOf(task._id) < 0;

			if(alreadyUpdated == false){
				shameHack(task);
			}

			function shameHack(task){
				var points,
					inc = {},
				 	difficultyKey = 'difficulty.level'+task.difficulty,
					satisfactionKey = 'satisfaction.level'+task.satisfaction;

				points = getPoints(task);

				inc = {
					done : -1,
					points : -points
				};

				inc[difficultyKey] = -1;
				inc[satisfactionKey] = -1;

				var updated = Points.update({user : userId}, {$inc : inc, $pull : {tasksCounted : task._id}}); 

			}		

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
		points : 0,
		tasksCounted : []
	};

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
		if(res.tasksCounted.indexOf(task._id) < 0 ){
			res.tasksCounted.push(task._id);
		}	
	});

	return res;

};
