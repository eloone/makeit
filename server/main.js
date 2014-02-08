initAllTag = function(){
	console.log('initAllTag');

	var alltag = Tags.findOne({alias : 'all'}),
		alltagId;

	if(_.isUndefined(alltag) || _.isEmpty(alltag)){
		alltagId = addTag({
			label : 'all'
		});
	}

	return alltagId;
};

//this can only be called when the client page is reloaded
//because we need the userID
initPoints = function(userId){
	console.log('initPoints');

	var points = Points.findOne({user : userId}),
		pointsId;

	if(_.isUndefined(points) || _.isEmpty(points)){
		var pointsData = getPointsData(userId);

		pointsId = Points.insert(_.extend(
			{
				user : userId
			}, 
			pointsData
		));
	} 

	return pointsId;
};

Meteor.startup(function () {
	// code to run on server at startup
	console.log('initAlltag in startup server');
	initAllTag();

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
  	  getAllTag : getAllTag,
  	  initAllTag : initAllTag,
  	  initPoints : initPoints,
  	  getCurrentUser : function(){
  	  	var user = Meteor.users.findOne({_id : this.userId});
  	  	
  	  	return(user);

  	  }
	});

});

