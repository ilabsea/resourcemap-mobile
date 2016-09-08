SessionController = {
  signIn: function (user) {
    UserSession.setUser(user)
  },
  currentUser: function () {
    return UserSession.getUser()
  },
  authUser: function (userParams) {
    App.isOnline() ? SessionOnlineController.authUser(userParams) : SessionOfflineController.authUser(userParams);
  },
  logout: function () {
    $('#form_login')[0].reset();
    if (!App.isOnline()){
      SessionOfflineController.logout();
    }
    else{
      $.xhrPool.abortAll();
      SessionOnlineController.logout();
    }
  }
};
