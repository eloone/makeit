Template['statusbar'].tag = function(){
	var filter = Session.get('tag');
  	return getTags([filter]);
};

Template['statusbar'].home = function(){
	return Session.get('home');
};

Template['statusbar'].countDone = function(){
	return countTasks(true);
};

Template['statusbar'].progress = function(){
	return getProgress();
};