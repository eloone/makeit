Template.menu.home = function () {
  return Session.get('home');
};

Template.menu.new = function () {
  return Session.get('new');
};

Template.menu.all = function () {
  return Session.get('all');
};

Template.menu.events({
  'click a': function (event) {
  	console.log($(event.target));
    if(!$(event.target).hasClass('current')){
    	$(event.target).parent().siblings().children().removeClass('current');
    	$(event.target).addClass('current');
    }
  }
});