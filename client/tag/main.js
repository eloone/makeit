// Pick out the unique tags from all todos in current list.
Template.listTag.tags = function () {
	var tag_infos = [];
	var total_count = 0;

	Tasks.find().forEach(function (task) {
  	_.each(task.tags, function (tag) {
      var tag_info = _.find(tag_infos, function (x) { return x.text === tag; });
        if (! tag_info)
          tag_infos.push({text: tag, count: 1});
        else
          tag_info.count++;
    });
    total_count++;
  });

  tag_infos = _.sortBy(tag_infos, function (x) { return x.tag; });
  tag_infos.unshift({text: null, count: total_count});

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
