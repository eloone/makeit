router = new (Backbone.Router.extend({

  routes: {
    ''        : 'index',
    '/'       : 'index',
    'new'     : 'new',
    'tag/:tag': 'tag',
    'tag/:tag/orderby/:filter': 'tag',
    'user-stats' : 'stats',
    'dashboard' : 'dashboard',
    '*notFound': 'notFound'
  },

  index: function(){
    console.log('in router user');
    console.log(Session.get('userReady'));
    console.log(Meteor.user());
var router = this;
    //Meteor.call('getCurrentUser', function(user){
      //router.navigate('/tag/all', true);
    //});

    Deps.autorun(function (c) {
      if (! Meteor.user())
        return;

      c.stop();
      router.navigate('/tag/all', true);
    });

    if(Meteor.user()){
     // this.navigate('/tag/all', true);
    }
  },

  new: function(){
    Session.set('new', true);
  },

  dashboard : function(){
    Session.set('dashboard', true);
  },

  stats : function(){
    Session.set('stats', true);
  },

  tag: function (tag, filter) {

    var router = this;

    Deps.autorun(function (c) {

      if (!Meteor.user()){
        //router.navigate('/', true);
        //return;
      }
        c.stop();
      
      Session.set('tag', tag);

      //i make a server call for this because local collection behaviour is really erratic - arfff
      var currentTag, allTag;

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

      Meteor.call('getAllTag', function(err, result){
        allTag = result;

        if(!_.isUndefined(allTag) && !_.isEmpty(allTag)){
          Session.set('alltagId', allTag._id);
        }
        else{
          console.log('DB could not retrieve all tag in router');
          Session.set('page404', true);
        }

      });

      if(!_.isUndefined(filter)){
        Session.set('filter', filter);
      }else{
        Session.set('filter', 'default');
      }

    });//end Deps.autorun
    
  },

  notFound : function(){
    Session.set('page404', true);
  }

}))();