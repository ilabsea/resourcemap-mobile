var LayerMembershipController = {
  synLayerMembership: function (cId, newLayermemberships) {
    var uId = UserSession.getUser().id;
    LayerMembershipOffline.fetchByCollectionUserId(cId, uId, function (oldLayermemberships) {
      LayerMembershipOffline.remove(oldLayermemberships);
      LayerMembershipOffline.add(uId, newLayermemberships);
    });
  }
};
