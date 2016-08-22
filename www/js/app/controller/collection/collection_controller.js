CollectionController = {
  id: "",
  name: "",
  setCurrentId: function(id){
    CollectionController.id = id;
  },
  getCurrentId: function(){
    return CollectionController.id;
  },
  get: function() {
    var currentUser = SessionHelper.currentUser();
    if (!App.isOnline()) {
      CollectionOfflineController.getByUserId(currentUser);
    } else {
      CollectionOnlineController.getByUserId(currentUser);
    }
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
