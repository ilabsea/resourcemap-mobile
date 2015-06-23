$(function () {

  $(document).delegate('#page-collection-list', 'pageshow', function () {
    App.emptyHTML();
    SiteList.clear();
    hideElement($("#info_sign_in"));
    CollectionController.get();
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.countByUserId(currentUser.id);
  });

  $(document).delegate('#page-collection-list li', 'click', function () {
    var cId = $(this).attr("data-id");
    App.DataStore.set("cId", cId);
    var cName = $(this).attr("data-name");
    App.DataStore.set("collectionName", cName);
    CollectionView.displayName({name: cName});
    CollectionController.getOne(cId);
    if (App.isOnline())
      MembershipOnlineController.getByCollectionId(cId);
  });
});