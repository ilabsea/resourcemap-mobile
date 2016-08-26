CollectionOfflineController = {
  getByUserId: function () {
    var currentUser = SessionHelper.currentUser();
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var asyncTotal = 0;
      var collectionData = [];
      $.each(collections, function (_ , collection) {
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
      CollectionController.collection = collection._data;
    });
  }
};
