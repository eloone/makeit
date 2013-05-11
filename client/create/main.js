tagRegexp = /#([^\s]*)/g;

// Extract hash tags from a text
extractHashTags = function (text) {
  return _.map(text.match(tagRegexp), function (text) {
    return text.replace(/^#/, '');
  });
};

// Remove hash tags from a text
stripHashTags = function (text) {
  return text.replace(tagRegexp, '').trim();
};

// Get cursor score
getCursorScore = function (cursor) {
  return $('[data-type=' + cursor + '] i').not('.empty').length;
};

Template.create.events({
  'keyup [name=task]': function (event) {
    if (event.keyCode !== 13) // 13 = enter
      return true;

    var $target = $(event.target),
        text = $target.val();

    // Insert task
    Tasks.insert({
      text: stripHashTags(text),
      tags: extractHashTags(text),
      satisfaction: getCursorScore('satisfaction'),
      difficulty: getCursorScore('difficulty'),
      done: false
    });

    // Clear input
    $target.val('');
  },

  'click .cursor i': function (event) {
    var $target = $(event.target);
    $target.prevAll().andSelf().removeClass('empty');
    $target.nextAll().addClass('empty');
  }
});