tagRegexp = /#([^\s]*)/g;

// Extract hash tags from a text
extractHashTags = function (text) {
  return text.match(tagRegexp).replace(/^#/, '');
};

// Remove hash tags from a text
stripHashTags = function (text) {
  return text.replace(tagRegexp, '').trim();
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
      done: false
    });

    // Clear input
    $target.val('');
  }
});