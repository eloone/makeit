Template['statusbar'].tag = function(){
	var tagId = Session.get('tagId');

	if(!tagId){
		return;
	}

	var tag = Tags.findOne({_id : tagId});

	var formatted = formatTags(tag);

	if(_.isUndefined(formatted))
    	return[];

    Session.set('tagSatisfaction', formatted[0].satisfaction);
    Session.set('tagDifficulty', formatted[0].difficulty);

	return formatted[0];
};

Template['statusbar'].stats = function(){
	return Session.get('stats');
};

Template['statusbar'].new = function(){
	return Session.get('new');
};

Template['statusbar'].dashboard = function(){
	return Session.get('dashboard');
};

Template['statusbar'].isall = function(){
	return Session.get('tag') == 'all';
};

Template['statusbar'].events({
	'dblclick .category' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget);
        
        if(Session.get('tag') != 'all'){
        	$target.attr('contenteditable', true);
        	$target.focus();
    	}
	},
	'blur .category' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

        $target.attr('contenteditable', false);
	},
	'keyup .category' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

        if(event.keyCode == 13){
        	$target.find('br').remove();

        	Meteor.call('updateTag', {_id : Session.get('tagId'), set : {label : $target.text()}}, 
        		function(err, result){
        			if(result){
        				var tag = Tags.findOne({_id : Session.get('tagId')});
 
        				Backbone.history.navigate('/tag/'+tag.alias, {replace : true});
        				$target.blur();
        			}
        		}
        	);
        }
	}
});