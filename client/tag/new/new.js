Template['new-tag'].placeholder = function(){

	return 'You can type your new goal here and press Enter to create it';
};

Template['new-tag'].events({
	'keyup .input' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

        $target.addClass('typing');

        //13 = enter
        if(event.keyCode == 13){
        	$target.find('br').remove();
        	//create new tag
        	var alltag = Tags.findOne({alias : 'all'});

        	//calls method addTag on the server
        	Meteor.call('addTag', {label : $target.text(), parent : alltag._id}, 
        		function(err, id){
	        		if(id){
	        			var newtag = Tags.findOne({_id : id});

	        			window.location.href = '/tag/'+newtag.alias;
	        		}
        		}
        	);
        }
	},
	'mousedown .input' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget),
        placeholder = $target.siblings('.placeholder').html().trim(),
        text = $target.html().trim();
        
        if(text == placeholder){
        	$target.html('');
        	$target.focus();
        }
	},
	'blur .input' : function(event){
		var $target = $(event.target),
        $currentTarget = $(event.currentTarget);

        $target.removeClass('typing');
		
        if($target.html().trim() == ''){
        	$target.html($target.siblings('.placeholder').html().trim());
        }
	}
 
});