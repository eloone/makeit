router = new (Backbone.Router.extend({

  routes: {
    ''        : 'all',
    'tag/:tag': 'tag'
  },

  all: function () {
    this.navigate('tag/all', {trigger: true});
  },

  tag: function (tag) {
    Session.set('tag', tag === 'all' ? null : tag);
  }
}))();