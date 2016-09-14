var ValidationHelper = {
  _popUpMsgErrorElement: "",
  setPopUpMsgError: function (popUpMsgError) {
    this._popUpMsgErrorElement = popUpMsgError;
  },
  getElementsByClass: function (validator, className) {
    var l = validator.errorList.length;
    for (var i = 0; i < l; i++) {
      var classElement = $("." + className);
      break;
    }
    return classElement;
  },
  invalidHierarchy: function (classHierarchyElement) {
    for (var i = 0; i < classHierarchyElement.length; i++) {
      var idElement = classHierarchyElement[i].id;
      this.validateHierarchyChange(idElement);
    }
  },
  invalidImage: function (classElement) {
    for (var i = 0; i < classElement.length; i++) {
      var idElement = classElement[i].id;
      this.validateImageChange(idElement);
    }
  },
  invalidHandler: function (validator, popUpMsgErrorElement) {
    var hierarchyElement = this.getElementsByClass(validator, "tree");
    var imageElement = this.getElementsByClass(validator, "image");
    this.setPopUpMsgError(popUpMsgErrorElement);
    this.invalidHierarchy(hierarchyElement);
    this.invalidImage(imageElement);
    this.showPopUpErrorMessage();
  },
  handleSubmitHandler: function (popUpMsgErrorElement, callback) {
    this.setPopUpMsgError(popUpMsgErrorElement);
    var classImage = $(".image");
    var classHierarchy = $(".tree");
    var h = true, b = true, user = true;
    h = this.hierarchySubmitHandler(classHierarchy);
    b = this.imageSubmitHandler(classImage);
    user = this.userSubmitHandler();
    if (b && h && user) {
      callback();
    } else {
      this.showPopUpErrorMessage();
    }
  },
  userSubmitHandler: function () {
    var errors = ValidList.getValid();
    var valids = $.map(errors, function (err) {
      if (!err.isValid) {
        ValidationHelper.AddClassUserError(err.id);
      }
      return err.isValid;
    });
    if (App.allBooleanTrue(valids)) {
      return true;
    } else {
      return false;
    }
  },
  hierarchySubmitHandler: function (classHierarchyElement) {
    var h = true;
    for (var i = 0; i < classHierarchyElement.length; i++) {
      var idElement = classHierarchyElement[i].id;
      var $element = $("#" + idElement);
      if ($element.attr('required')) {
        var node = $element.tree('getSelectedNode');
        if (!node.id) {
          h = false;
          this.AddClassHierarchyError(idElement);
        }
        else {
          this.removeClassHierarchyError(idElement);
        }
      }
    }
    return h;
  },
  imageSubmitHandler: function (classElement) {
    var b = true;
    for (var i = 0; i < classElement.length; i++) {
      var idElement = classElement[i].id;
      var $element = $("#" + idElement);
      if ($element.attr('required')) {
        if ($element.attr('src') == '') {
          b = false;
          this.AddClassImageError(idElement);
        }
        else
          this.removeClassImageError(idElement);
      }
    }
    return b;
  },
  showPopUpErrorMessage: function () {
    var id = this._popUpMsgErrorElement;
    $(id).show().delay(4000).fadeOut();
    $(id).focus();
  },
  validateHierarchyChange: function (idElement) {
    var $tree = $("#" + idElement);
    if ($tree.attr('required')) {
      var node = $tree.tree('getSelectedNode');
      if (!node.id) {
        this.AddClassHierarchyError(idElement);
      }
      else {
        this.removeClassHierarchyError(idElement);
      }
    }
  },
  validateImageChange: function (idElement) {
    var $element = $("#" + idElement);
    if ($element.attr('required')) {
      if ($element.attr('src') == '')
        this.AddClassImageError(idElement);
      else
        this.removeClassImageError(idElement);
    }
  },
  validateSelectChange: function (element) {
    if (element.required) {
      var $parent = $(element).closest(".ui-select");
      var id = element.id;
      if (element.value === "") {
        $parent.removeClass('valid').addClass('error');
        $("#label_" + id).css("display", "block");
      }
      else {
        $parent.removeClass('error').addClass('valid');
        var label = $parent.next();
        if ($(label).attr("for") == id)
          label.remove();
        $("#label_" + id).css("display", "none");
      }
    }
  },
  removeClassImageError: function (id) {
    var $parent = $("#property_" + id + "_container");
    $parent.removeClass("error");
    $("#label_" + id).css("display", 'none');
  },
  removeClassHierarchyError: function (id) {
    $("#" + id).removeClass("error");
    $("#label_" + id).css("display", 'none');
  },
  AddClassImageError: function (id) {
    var $parent = $("#property_" + id + "_container");
    $parent.addClass("error");
    $("#label_" + id).css("display", 'block');
  },
  AddClassHierarchyError: function (id) {
    $("#" + id).addClass("error");
    $("#label_" + id).css("display", 'block');
  },
  AddClassSelectError: function (element) {
    if ($(element)[0].tagName.toLowerCase() === "select") {
      if (!$(element).val()) {
        var $parent = $(element).closest('.ui-select');
        $parent.addClass("error");
      }
      $("#label_" + $(element).attr("id")).css("display", "none");
    }
  },
  resetFormValidate: function (formElement) {
    var $element = $(formElement);
    var validator = $element.validate();
    validator.resetForm();
  },
  AddClassUserError: function (id) {
    $("#" + id).addClass("error");
    $("#label_" + id).css("display", 'block');
  },
  removeClassUserError: function (id) {
    if (!$("#" + id).attr('required'))
      $("#" + id).removeClass("error");
    $("#label_" + id).css("display", 'none');
  },
  showValidateMessage: function (selector, message) {
    var $element = $(selector)
    if(message != undefined)
      $element.html(message)

    $element.show().delay(3000).fadeOut();
  }
};
