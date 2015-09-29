$(function () {
  $(document).delegate('#page-collection-list', 'pageshow', function () {
    App.emptyHTML();
    hideElement($("#info_sign_in"));
    CollectionController.get();
    CollectionController.setCurrentId("");
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.countByUserId(currentUser.id);
  });

  $(document).delegate('#page-collection-list li', 'click', function () {
    var cId = $(this).attr("data-id");
    CollectionController.setCurrentId(cId);
    var cName = $(this).attr("data-name");
    App.DataStore.set("collectionName", cName);
    CollectionView.displayName({name: cName});
    CollectionController.getOne();
    //for user field
    if (App.isOnline())
      MembershipOnlineController.getByCollectionId(cId);
  });
});