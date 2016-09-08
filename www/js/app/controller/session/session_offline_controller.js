var SessionOfflineController = {
  authUser: function (userParams) {
    UserOffline.fetchByEmail(userParams.email, function (user) {
      if (user === null) {
        showElement($('#noMailInDb'));
      }
      if (user.password === userParams.password) {
        SessionController.signIn(user);
        App.redirectTo("#page-collection-list");
      }
      else {
        showElement($('#invalidmail'));
      }
      hideElement($('#noMailInDb'));
      hideElement($('#invalidmail'));
    });
  },
  logout: function () {
    App.Session.resetState();
    App.redirectTo("#page-login");
  }
};
