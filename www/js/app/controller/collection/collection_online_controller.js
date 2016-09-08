CollectionOnlineController = {
  getByUserId: function (userId) {
    ViewBinding.setBusy(true);
    CollectionModel.fetch(function (collections) {
      FieldController.hasFields = false;
      var collectionData = [];
      $.each(collections, function (key, collection) {
        var cId = collection.id;
        LayerMembershipOnlineController.getByCollectionId(cId);
        FieldOnlineController.getByCollectionId(cId);
        SiteOffline.countByCollectionIdUserId(cId, userId, function (count) {
          var item = CollectionController.params(collection, userId, count);
          collectionData.push(item);

          if (key === collections.length - 1) {
            CollectionView.displayList({collectionList: collectionData});
            CollectionController.synCollectionByUser(userId, collectionData);
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
