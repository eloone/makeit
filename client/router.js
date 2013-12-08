router = new (Backbone.Router.extend({

  routes: {
    ''        : 'index',
    '/'       : 'index',
    'all'     : 'all',
    'new'     : 'new',
    'tag/:tag': 'tag',
    '*notFound': 'notFound'
  },

  index: function(){
    Session.set('home', true);
  },

  all: function () {
    //this.navigate('tag/all', {trigger: true});
    Session.set('all', true);
  },

  new: function(){
    Session.set('new', true);
  },

  tag: function (tag) {
    Session.set('tag', tag === 'all' ? null : tag);
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();