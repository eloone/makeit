// Return tasks
getTasks = function (done) {
  if (! Meteor.user())
    return ;

  var tasks,
      tagId = Session.get('tagId') || '',
      tasksWithTag,
      result = [],
      //date,fun,difficulty,default
      filter = Session.get('filter'),
      order = Session.get(filter+'Desc') === true || _.isUndefined(Session.get(filter+'Desc')) ? 'desc' : 'asc';

      switch(filter){
        case 'fun':
          return getTagsByFun(done, tagId, order);
        break;
        case 'difficulty':
          return getTagsByDifficulty(done, tagId, order);
        break;
        case 'date':
          return getTagsByDate(done, tagId, order);
        break;
        default :
          return getTagsDefault(done, tagId);
        break;
      }
  
};

//Default ordering
//we present tasks attached to a goal first ordered by date recent to old
getTagsDefault = function(done, tagId){
  var tasksWithTag = Tasks.find({
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.tags.length > 1"
  },
  {
    sort : {
      date : -1
    }
  }).fetch();

 var tasks = Tasks.find(
  {
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.tags.length <= 1"
  },
  {
    sort: {
      date: -1,
      //difficulty:-1
    }
  }).fetch();

  result = tasksWithTag.concat(tasks);

  // Sort first by decreasing satisfaction then increasing difficulty
  // Easy and short first
  return result;
};

getTagsByFun = function(done, tagId, order){
  var tasks = Tasks.find({
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.satisfaction >= 1"
  },
  {
    sort : {
      satisfaction : order == 'asc' ? 1 : -1
    }
  }).fetch();

  return tasks;
}

getTagsByDifficulty = function(done, tagId, order){
  var tasks = Tasks.find({
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    },
    $where : "this.difficulty >= 1"
  },
  {
    sort : {
      difficulty : order == 'asc' ? 1 : -1
    }
  }).fetch();

  return tasks;
}

getTagsByDate = function(done, tagId, order){
  var tasks = Tasks.find({
    user : Meteor.user()._id,
    done : done,
    tags : {
      $in : [tagId]
    }
  },
  {
    sort : {
      date : order == 'asc' ? 1 : -1
    }
  }).fetch();

  return tasks;
}
