router = new (Backbone.Router.extend({

  routes: {
    ''        : 'index',
    '/'       : 'index',
    'tag/:tag': 'tag',
    '*notFound': 'notFound'
  },

  index: function(){

  },

  all: function () {
    this.navigate('tag/all', {trigger: true});
  },

  tag: function (tag) {
    Session.set('tag', tag === 'all' ? null : tag);
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();