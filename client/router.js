router = new (Backbone.Router.extend({

  routes: {
    ''        : 'index',
    '/'       : 'index',
    'new'     : 'new',
    'tag/:tag': 'tag',
    '*notFound': 'notFound'
  },

  index: function(){
    Session.set('home', true);
  },

  new: function(){
    Session.set('new', true);
  },

  tag: function (tag) {

    Session.set('tag', tag);

    //i make a server call for this because local collection behaviour is really erratic - arfff
    var currentTag;

    Meteor.call('getCurrentTag', tag, function(err, result){
      currentTag = result;
      
      if(!_.isUndefined(currentTag) && !_.isEmpty(currentTag)){
        Session.set('tagId', currentTag._id);
      }
      else{
        console.log('DB could not retrieve current tag in router');
        Session.set('page404', true);
      }

    });
    
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();