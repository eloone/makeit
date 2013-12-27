//Tags are independent from tasks
//create a tag
//returns the id inserted
addTag = function (options) {

  if(_.isUndefined(options.label))
    return;

  if(_.isEmpty(options.label))
    return;

  //alias must be unique but i don't know how to unique : true in meteor
  var tag = Tags.findOne({alias : getAlias(options.label)});

  if(tag){
  	console.log('Did not add task '+options.label+' because it is a duplicate');
  	return {error : 'duplicate'};
  }
  	
  var newtagId = Tags.insert(
  	_.extend({
	    date: new Date(),
	    user: Meteor.user()._id,
	    parent : null,
	    label : options.label
	  }, options, {
	    alias : getAlias(options.label)
	  })
  );

  return newtagId;
};

//updates a tag
//returns id updated if operation is successful
/*
options = {
	_id : id,
	set : { data to set },
	inc : { data to inc },
	taskId : taskId
}
*/
updateTag = function(options){
  if(_.isUndefined(options._id))
    return;

  //returns {numberAffected : nb}
  var nbUpdated = Tags.upsert(
    {
      // Selector
      _id: options._id
    },
    {
      // Modifier
      $set: _.extend({
        date: new Date(),
        user: Meteor.user()._id
      }, toSet(options)),
      $inc : toInc(options)
    }
  );

  if(!_.isNaN(nbUpdated)){
  	return options._id;
  }

  return nbUpdated;
};

getCurrentTag = function(alias){
	var tag = Tags.findOne({alias : alias});

	return tag;
};

//Helper functions for update
toSet = function(options){
	var toSet = {};
	
	if(_.isUndefined(options.set))
		return toSet;

	for(var i in options.set){
		if(options.set.hasOwnProperty(i)){
			if(!_.isUndefined(options.set[i])){
				if(i == 'label'){
					toSet['alias'] = getAlias(options.set[i]);
				}

				toSet[i] = options.set[i];
			}
		}
	}

	return toSet;

};

toInc = function(options, counter){	
	var toUpdate = {};

	if(_.isUndefined(options.inc))
		return toUpdate;

	for(var i in options.inc){
		if(options.inc.hasOwnProperty(i)){
			if(!_.isUndefined(options.inc[i])){
				toUpdate[i] = options.inc[i];
			}
		}
	}

	return toUpdate;
}

//Helper functions for insert
getAlias = function(label){
  if(typeof label != 'string')
    return;

  var alias = label.toLowerCase().latinise().replace(/[^\w -]+/g,'').replace(/ +/g,'-');

  return alias;
};