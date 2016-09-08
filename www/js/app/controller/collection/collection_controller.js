CollectionController = {
  id: "",
  name: "",
  collection: {},
  nbOfflineSites: "",
  setCurrentId: function(id){
    CollectionController.id = id;
  },
  getCurrentId: function(){
    return CollectionController.id;
  },
  getByUserId: function(userId) {
    if(App.isOnline())
      CollectionOnlineController.getByUserId(userId);
    else
      CollectionOfflineController.getByUserId(userId);
  },
  synCollectionByUser: function(userId, newCollections) {
    CollectionOffline.destroyAllByUserId(userId, function(){
      console.log('success ');
      CollectionOffline.add(newCollections);
    })
  },
  getOne: function() {
    if (App.isOnline()) {
      CollectionOnlineController.getOne();
    } else {
      CollectionOfflineController.getOne();
    }
  },
  params: function(collection, userId, count){
    var item = {
      name: collection.name,
      description: collection.description,
      is_visible_location: collection.is_visible_location,
      is_visible_name: collection.is_visible_name,
      linkpagesite: "#page-site-list",
      user_id: userId,
    };

    item.idcollection = collection.idcollection || collection.id;
    item.displayCount = count == 0 ? "" : count;
    return item;
  }
};
