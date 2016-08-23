CollectionOfflineController = {
  getByUserId: function (currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var asyncTotal = 0;
      var collectionData = [];
      $.map(collections, function (collection) {
        var currentUser = SessionHelper.currentUser();
        SiteOffline.countByCollectionIdUserId(collection.idcollection(), currentUser.id, function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, fromServer = false);
          asyncTotal++;
          collectionData.push(item);

          if (asyncTotal === collections.length) {
            CollectionView.displayList({collectionList: collectionData});
          }
        });
      });
    });
  },
  getOne: function () {
    CollectionOffline.fetchOne(CollectionController.id, function (collection) {
      CollectionController.collection = collection;
    });
  }
};
