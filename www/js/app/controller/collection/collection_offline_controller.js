CollectionOfflineController = {
  getByUserId: function (userId) {
    CollectionOffline.fetchByUserId(userId, function (collections) {
      var asyncTotal = 0;
      var collectionData = [];
      $.each(collections, function (_ , collection) {
        SiteOffline.countByCollectionIdUserId(collection.idcollection(), userId, function (count) {
          var item = CollectionHelper.dataCollection(collection, userId, count, fromServer = false);
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
