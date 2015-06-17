App.initialize();
App.onDeviceReady();
$(function() {
  FastClick.attach(document.body);
  Translation.setLang(Translation.getLang());
  Translation.renderLang();
  $.mobile.defaultPageTransition = 'none'; 

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });
  
  $(document).delegate('#page-login', 'pagebeforehide', function() {
    ValidationHelper.resetFormValidate("#form_login");
  });
  
  $(document).delegate('#btn_confirm_endpoint', 'click', function() {
    var url = $("#input_endpoint").val();
    App.DataStore.set("URL", url);
    App.redirectTo("index.html");
  });
  
  $(document).delegate('#page-endpoint', 'pagebeforeshow', function() {
    var url = App.DataStore.get("URL");
    $("#input_endpoint").val(url);
  });
 
});