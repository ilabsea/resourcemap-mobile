$(function () {
  $.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ".invisible :hidden:not(select)",
    focusInvalid: false,
    errorPlacement: function () {
    }
  });

  $('#form_login').validate({
    invalidHandler: function () {
      ValidationHelper.setPopUpMsgError("#validation_email_psd");
      ValidationHelper.showPopUpErrorMessage();
    },
    submitHandler: function () {
      var userParams = {email: $("#email").val(), password: $("#password").val()};
      SessionController.authUser(userParams);
    }
  });
});
