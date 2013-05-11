router = new (Backbone.Router.extend({

  routes: {
    ''        : 'all',
    'tag/:tag': 'tag'
  },

  all: function () {
    this.navigate('tag/null', {trigger: true});
  },

  tag: function (tag) {
    Session.set('tag', tag === 'null' ? null : tag);
  }
}))();