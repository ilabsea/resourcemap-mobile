App.initialize();
App.onDeviceReady(); 
$(function () {
  FastClick.attach(document.body);
  Translation.setLang(Translation.getLang());
  Translation.renderLang();
  $.mobile.defaultPageTransition = 'none';

  $(document).delegate('#logout', 'click', function () {
    SessionController.logout();
  });
  
  $(document).delegate('#page-login', 'pageshow', function () {
    var url = App.DataStore.get("URL");
    EndPointView.display($("#page-about-release"), {url: url});
  });

  $(document).delegate('#page-login', 'pagebeforehide', function () {
    ValidationHelper.resetFormValidate("#form_login");
  });

  $(document).delegate('#btn_confirm_endpoint', 'click', function () {
    var url = $("#input_endpoint").val();
    var previous_url = App.DataStore.get("URL");
    if (url != previous_url)
      $.mobile.changePage('#page-confirm-endpoint', { role: 'dialog'});
    else
      App.redirectTo("#page-login");
  });

  $(document).delegate('#btn_confirm_accept_endpoint', 'click', function () {
    var url = $("#input_endpoint").val();
    App.resetCache();
    App.resetDb();
    App.DataStore.set("URL", url);
    App.redirectTo("#page-login");
  });

  $(document).delegate('#page-endpoint', 'pagebeforeshow', function () {
    var url = App.DataStore.get("URL");
    $("#input_endpoint").val(url);
  });

});