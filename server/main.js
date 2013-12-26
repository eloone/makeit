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
  	  toggleDone : toggleDone
	});

});


