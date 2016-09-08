CollectionOffline = {
  add: function(collections) {
    for(var i = 0; i<collections.length; i++){
      console.log(UserSession.getUser());
      console.log('collection : ', collections[i]);
      var collectionParams = {
        idcollection: collections[i].idcollection,
        name: collections[i].name,
        description: collections[i].description,
        is_visible_location: collections[i].is_visible_location,
        is_visible_name: collections[i].is_visible_name,
        user_id: collections[i].user_id
      }
      var collectionObj = new Collection(collectionParams);
      persistence.add(collectionObj);
    }
    persistence.flush();
  },
  remove: function(collections) {
    collections.forEach(function(collection) {
      persistence.remove(collection);
    });
    persistence.flush();
  },
  fetchByUserId: function(userId, callback) {
    Collection.all().filter('user_id', '=', userId).list(null, callback);
  },
  fetchOne: function(cId, callback) {
    Collection.all().filter('idcollection', "=", cId).one(null, callback);
  },
  destroyAllByUserId: function(userId, callback) {
    Collection.all().filter('user_id', '=', userId).destroyAll(null, callback);
  }
};
