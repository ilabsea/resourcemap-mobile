CameraModel = {
  fieldId: '',
  openCameraDialog: function(fieldId) {
    this.fieldId = fieldId;
    this.handleOpenCamera();
  },
  invokeCamera: function(cameraType) {
    SiteCamera.takePhoto(this.fieldId, cameraType);
    CameraModel.closeDialog();
  },
  closeDialog: function() {
    $("#cameraDialog").hide();
    $.mobile.activePage.removeClass('ui-disabled');
  },
  handleOpenCamera: function(){
    // localStorage['no_update_reload'] = 1;
    $.mobile.activePage.addClass("ui-disabled");
    $("#cameraDialog").show();
    $("#cameraDialog").css("z-index", 200000);
  }
};
