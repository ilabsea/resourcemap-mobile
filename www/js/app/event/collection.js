$(function () {
  $(document).delegate('#page-collection-list', 'pageshow', function () {
    App.emptyHTML();
    hideElement($("#info_sign_in"));
    CollectionController.id = "";
    var currentUser = UserSession.getUser();
    CollectionController.getByUserId(currentUser.id);
    SiteOfflineController.toggleViewOfflineSitesBtn();
  });

  $(document).delegate('#page-collection-list li', 'click', function () {
    var cId = $(this).attr("data-id");
    var cName = $(this).attr("data-name");
    CollectionController.id = cId;
    CollectionController.name = cName;
    CollectionView.displayName({name: cName});
    CollectionController.getOne();
    //for user field
    if (App.isOnline())
      MembershipOnlineController.getByCollectionId(cId);
  });
});
