// Check if the user has won an award
checkAward = function () {
  var tags = getTags();

  var tag = _.reduce(tags, function (memo, tag) {
    if (! memo && tag.complete)
      memo = tag;
    return memo;
  }, null);

  if (tag)
    alert('Award ! (difficulty: ' + tag.difficultyAverage + ')');
};