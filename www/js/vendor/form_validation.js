$(document).ready(function () {
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
      var email = $("#email").val();
      var password = $("#password").val();
      SessionController.authUser(email, password);
    }
  });

  $('#form_site').validate({
    errorPlacement: function (error, element) {
      ValidationHelper.AddClassSelectError(element);
      error.insertAfter($(element).parent());
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_form_site");
    },
    submitHandler: function () {
      ValidationHelper.handleSubmitHandler("#validation_form_site",
          function () {
            if (SiteController.form == 'new')
              SiteController.add();
            else if (SiteController.form == 'update_online')
              SiteOnlineController.updateBySiteId();
            else if (SiteController.form == 'update_offline')
              SiteOfflineController.updateBySiteId();
          });
    }
  });
});