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
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();