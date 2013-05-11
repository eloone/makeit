// Pick out the unique tags from all todos in current list.
Template.listTag.tags = function () {
	var tag_infos = [];
	var total_count = 0.0;
  var total_done = 0.0;
  var total_progress = 0.0;

	Tasks.find().forEach(function (task) {
  	_.each(task.tags, function (tag) {
      var tag_info = _.find(tag_infos, function (x) { return x.text === tag; });
        if (! tag_info) {
          if (task.done) {
            tag_infos.push({text: tag, count: 1.0, done: 1});
          }
          else {
            tag_infos.push({text: tag, count: 1.0, done: 0});
          }
        }
        else {
          tag_info.count++;
          if (task.done) tag_info.done++;
        }
    });
    if (task.done) total_done++;
    total_count++;
  });

  // Compute the progress
  for (var i=0; i<tag_infos.length; i++) {
    tag_infos[i].progress = Math.round(100 * tag_infos[i].done / tag_infos[i].count);
  }

  total_progress = Math.round(100 * total_done / total_count);
  console.log('total_count', total_count);
  console.log('total_done', total_done);
  console.log('total_progress', total_progress);

  tag_infos = _.sortBy(tag_infos, function (x) { return x.tag; });
  tag_infos.unshift({text: null, count: total_count, done: total_done, progress: total_progress});

  return tag_infos;
}

Template.listTag.tag_text = function () {
  return this.text || "All items";
};

Template.listTag.selected = function () {
  return Session.equals('listTag', this.text) ? 'selected' : '';
};

Template.listTag.events({
  'mousedown .tag': function () {
    if (Session.equals('listTag', this.text))
      Session.set('listTag', null);
    else
      Session.set('listTag', this.text);
  }
});
