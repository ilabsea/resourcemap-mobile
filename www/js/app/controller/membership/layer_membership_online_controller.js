var LayerMembershipOnlineController = {
  getByCollectionId: function(cId){
    LayerMembershipModel.fetch(cId, function (layerMemberships) {
      LayerMembershipController.synLayerMembership(cId, layerMemberships)
    }, function(error){
      App.log('error: ', error);
    });
  }
}