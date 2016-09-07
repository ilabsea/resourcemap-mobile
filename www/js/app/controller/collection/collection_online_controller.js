CollectionOnlineController = {
  getByUserId: function (uId) {
    ViewBinding.setBusy(true);
    CollectionModel.fetch(function (collections) {
      FieldController.hasFields = false;
      var collectionData = [];
      $.each(collections, function (key, collection) {
        var cId = collection.id;
        LayerMembershipOnlineController.getByCollectionId(cId);
        FieldOnlineController.getByCollectionId(cId);
        SiteOffline.countByCollectionIdUserId(cId, uId, function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, fromServer = true);
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
      CollectionController.collection = collection;
    });
  }
};
