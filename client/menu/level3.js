Template['menu-level3'].default = function(){
	return Session.equals('filter', 'default');
};

Template['menu-level3'].fun = function(){
	return Session.equals('filter', 'fun');
};

Template['menu-level3'].difficulty = function(){
	return Session.equals('filter', 'difficulty');
};

Template['menu-level3'].date = function(){
	return Session.equals('filter', 'date');
};

Template['menu-level3'].classSort = function(filter){
	var desc = Session.get(filter+'Desc');

	if(desc === true || _.isUndefined(desc)){
		return 'orderDesc';
	}else{
		return 'orderAsc';
	}
};

Template['menu-level3'].hasSatisfaction = function(){
	return Session.get('tagSatisfaction') > 0;
};

Template['menu-level3'].hasDifficulty = function(){
	return Session.get('tagDifficulty') > 0;
};


Template['menu-level3'].events({
	'click .filter, li, i' : function(event, template){
		var $target = $(event.target),
			$currentTarget = $(event.currentTarget),
			tag = Session.get('tag'),
			$a = $currentTarget;


			if($target.is('i')){
				$a = $target.parent('a');
			}

			if($target.is('li')){
				$a = $target.children('a');
			}

			var href = $a.attr('href');

			$a.toggleClass('orderAsc');
			$a.toggleClass('orderDesc');

			if($a.hasClass('orderDesc')){
				Session.set(href+'Desc', true);
			}else{
				Session.set(href+'Desc', false);
			}

			event.preventDefault();
	
			if(!_.isEmpty(href)){
				Backbone.history.navigate('tag/'+tag+'/orderby/'+href, true);
			}else{
				Backbone.history.navigate('tag/'+tag, true);
			}
			
	},
	'click li' : function(event){
		var $target = $(event.target),
			$currentTarget = $(event.currentTarget);

		$currentTarget.siblings().removeClass('current');
		$currentTarget.addClass('current');
	}
});