Meteor.startup(function () {
	// code to run on server at startup
	Meteor.methods({
	  //method to insert a tag	
	  addTag : addTag,
	  //method to update a tag
	  updateTag : updateTag,
	  
	  getAvatar : function () {
    	return 'ok';
  	  },
  	  addTask : addTask,
  	  removeTask : removeTask,
  	  updateTask : updateTask,
  	  toggleDone : toggleDone,
  	  getCurrentTag : getCurrentTag,
  	  initAllTag : initAllTag,
  	  initPoints : initPoints
	});

});

initAllTag = function(userId){
	var alltag = Tags.findOne({alias : 'all', user : userId}),
		alltagId;

	if(_.isUndefined(alltag) || _.isEmpty(alltag)){
		alltagId = addTag({
			label : 'all'
		});
	}

	return alltagId;
};

initPoints = function(userId){
	var points = Points.findOne({user : userId}),
		pointsId;

	if(_.isUndefined(points) || _.isEmpty(points)){
		var pointsData = getPointsData();

		pointsId = Points.insert(_.extend(
			{
				user : userId
			}, 
			pointsData
		));
	} 

	return pointsId;
};


