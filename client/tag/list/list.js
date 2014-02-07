// Pick out the unique tags from all todos in current list.
Template['tag-list'].tags = function () {
  var alltagid = Session.get('alltagId');

  if(!alltagid){
    return;
  }

  var tags = Tags.find({parent : alltagid, _id : {$not : alltagid}}).fetch();

  var formatted = formatTags(tags);

  if(_.isUndefined(formatted))
    return[];

  return formatted;
};

Template['tag-list'].alltag = function () {
  var alltagid = Session.get('alltagId');

  if(!alltagid){
    return;
  }

  var alltag = Tags.findOne({_id : alltagid});

  var formatted = formatTags(alltag);
  if(_.isUndefined(formatted))
    return[];

  return formatted[0];
};

Template['tag-list'].events({

  'click li' : function(event){
    var $target = $(event.target);
    if($target.is('a')){
      $target.parent('li').addClass('current').siblings().removeClass('current');
    }else{
      $target.addClass('current').siblings().removeClass('current');
    }

  }

});