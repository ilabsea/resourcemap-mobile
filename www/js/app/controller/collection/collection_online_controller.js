var CollectionOnlineController = {
  getByUserId: function (currentUser) {
    ViewBinding.setBusy(true);
    CollectionModel.fetch(function (collections) {
      var collectionData = [];
      $.each(collections, function (key, collection) {
        var cId = collection.id;
        LayerMembershipOnlineController.getByCollectionId(cId);
        FieldOnlineController.getByCollectionId(cId);
        SiteOffline.countByCollectionIdUserId(collection.id, currentUser.id, function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, true);
          collectionData.push(item);

          if (key === collections.length - 1) {
            CollectionView.displayList({collectionList: collectionData});
            CollectionController.synCollectionForCurrentUser(collectionData);
          }
        });
      });
    });
  },
  getOne: function () {
    CollectionModel.fetchOne(function (collection) {
      App.DataStore.set("collection", JSON.stringify(collection));
    });
  }
};