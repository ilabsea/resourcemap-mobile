var SessionOnlineController = {
  authUser: function (userParams) {
    var data = {user: userParams};
    hideElement($('#invalidmail'));
    ViewBinding.setBusy(true);

    UserModel.create(userParams, function (response) {
      userParams.auth_token = response.auth_token;

      UserOffline.fetchByEmail(userParams.email, function (user) {

        if (user === null)
          UserOffline.add(userParams);
        else {
          user.password = userParams.password;
          user.auth_token = userParams["auth_token"];
          persistence.flush();
        }

        SessionController.signIn(userParams);
        App.redirectTo("#page-collection-list");
      });
    }, function (x, t, m) {
      if (t === "timeout" || t === "notmodified") {
        alert("Internet connection problem");
      } else {
        showElement($('#invalidmail'));
      }
    });
  },
  logout: function () {
    UserModel.delete(function () {
      App.Session.resetState();
      App.redirectTo("#page-login");
    });
  }
};
