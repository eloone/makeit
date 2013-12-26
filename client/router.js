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
    var currentTag = Tags.findOne({alias : tag});
console.log(currentTag);
    if(!_.isEmpty(currentTag)){
      Session.set('tagId', currentTag._id);
    }
    else{
      console.log('DB could not retrieve current tag in router');
      Session.set('page404', true);
    }
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();