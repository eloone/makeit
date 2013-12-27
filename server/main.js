Meteor.startup(function () {
	// code to run on server at startup

	var alltag = Tags.findOne({alias : 'all', user : Meteor.userId});

	if(_.isUndefined(alltag) || _.isEmpty(alltag)){
		addTag({
			label : 'all'
		});
	}

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
  	  getCurrentTag : getCurrentTag
	});

});


