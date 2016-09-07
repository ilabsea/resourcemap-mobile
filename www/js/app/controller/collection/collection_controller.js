CollectionController = {
  id: "",
  name: "",
  collection: {},
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
  synCollectionForCurrentUser: function(newCollections) {
    var currentUser = SessionHelper.currentUser();
    CollectionOffline.fetchByUserId(currentUser, function(collections) {
      CollectionOffline.remove(collections);
      CollectionOffline.add(newCollections);
    });
  },
  getOne: function() {
    if (App.isOnline()) {
      CollectionOnlineController.getOne();
    } else {
      CollectionOfflineController.getOne();
    }
  }
};
