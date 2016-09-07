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
  getByUserId: function(uId) {
    if(App.isOnline())
      CollectionOnlineController.getByUserId(uId);
    else
      CollectionOfflineController.getByUserId(uId);
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
