forTagId = function(id, options){

	var ret = "";

    ret = ret + options.fn({id : id});

  return ret;
};

For = function(count, options) {
  var ret = "";

  for(var i=0, j=count; i<j; i++) {
    ret = ret + options.fn({count : count});
  }

  return ret;
};