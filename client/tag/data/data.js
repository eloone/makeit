Template['tag-data'].tag = function () {
  var filter = 	Session.get('tag');
  return getTags([filter]);
};