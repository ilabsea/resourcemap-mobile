ViewBinding = {
  __busy: false,
  __msg: "",
  setBusy: function(status) {
    ViewBinding.__busy = status;
    if (ViewBinding.__busy) 
      Spinner.show();
    else
      Spinner.hide();
  },
  setAlert: function(msg) {
    ViewBinding.__msg = msg;
    if (!ViewBinding.__msg)
      alert(ViewBinding.__msg);
  }
};