SkipLogic = {
  skipLogicNumber: function(element) {
    var val = $(element).val();
    var id = $(element).attr('id');
    var config = JSON.parse(
        App.DataStore.get("configNumberSkipLogic_" + id));
    if (config) {
      $.map(config, function(field_logic) {
        var op = field_logic.condition_type;
        if (Operators[op](val, field_logic.value)) {
          SkipLogic.handleSkipLogic(field_logic.field_id);
          return false;
        }
      });
    }
  },
  skipLogicYesNo: function(element) {
    var $element = $("#" + element);
    if ($element.attr('data-is_enable_field_logic')) {
      if ($element.attr('data-role') === "slider") {
        App.DataStore.set("yesNoField", element);
        var field_id = $('option:selected', $element).attr('data-field_id');
        SkipLogic.handleSkipLogic(field_id);
      }
    }
  },
  skipLogicSelectOne: function(element) {
    var $element = $("#" + element);
    var field_id = $('option:selected', $element).attr('data-field_id');
    SkipLogic.handleSkipLogic(field_id);
  },
  handleSkipLogic: function(field_id) {
    var id = "";
    if (field_id) id = field_id;
    if (id) {
      var skipToId = "#wrapper_" + field_id;
      var $parent = $(skipToId).parent().parent();
      triggerExpand($parent);

      scrollToHash(skipToId);

      setTimeout(function() {
        $("#" + field_id).focus();
      }, 500);

      SkipLogic.handleHighlightElement(field_id);
    }
  },
  skipLogicSelectMany: function(element) {
    var selectedValue = element.val();
    if (selectedValue) {
      var id = element.attr('id');
      var configOption = JSON.parse(
          App.DataStore.get("configSelectManyForSkipLogic_" + id));

      if (configOption.config.field_logics) {
        if ((configOption.id || configOption.idfield) == id) {
          $.each(configOption.config.field_logics, function(index, field_logic) {
            var selectedOptions = field_logic.selected_options;

            var b = false;
            var is_all = [];
            var all_condi = false;

            for (var i in selectedValue) {
              for (var j in selectedOptions) {
                if (selectedValue[i] == selectedOptions[j].value) {
                  b = true;
                  is_all.push(true);
                  break;
                }
              }
              if (b) {
                if (field_logic.condition_type == 'any') {
                  all_condi = true;
                  break;
                } else {
                  if (is_all.length == Object.keys(selectedOptions).length) {
                    all_condi = App.allBooleanTrue(is_all);
                    break;
                  }
                }
              }
            }
            if (all_condi) {
              var field_id = "wrapper_" + field_logic.field_id;
              SkipLogic.handleSkipLogic(field_id);
              return false;
            }
          });
        }
      }
    }
  },
  handleHighlightElement: function(field_id) {
    if ($("#" + field_id).attr('data-role') === "slider") {
      var slider = ($("#" + field_id).parent()).children()[2];
      $(slider).attr("id", "slider_" + field_id);
      var slider_id = $(slider).attr("id");

      SkipLogic.highlight("#" + slider_id, 'slider');
    }
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select')
      SkipLogic.highlight("#" + field_id, "select");
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'img')
      SkipLogic.highlight("#property_" + field_id + "_container", "img");
    else
      SkipLogic.highlight("#" + field_id, "others");
  },
  highlight: function(element, type) {
    var highlightedElement = App.DataStore.get("highlightedElement");
    var typeElement = App.DataStore.get("typeElement");
    if (highlightedElement) {
      if (highlightedElement !== element)
        SkipLogic.unhighlightElement(highlightedElement, typeElement);
      else
        return;
    }
    SkipLogic.highlightElement(element, type);
  },
  highlightElement: function(element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('highlighted').removeClass('unhighlighted');
    } else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "0 0 12px #3388cc",
        "-moz-box-shadow": "0 0 12px #3388cc",
        "box-shadow": "0 0 12px #3388cc"
      });
    } else
      $(element).addClass('highlighted').removeClass('unhighlighted');
    App.DataStore.set("highlightedElement", element);
    App.DataStore.set("typeElement", type);
  },
  unhighlightElement: function(element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('unhighlighted').removeClass('highlighted');
    } else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "",
        "-moz-box-shadow": "",
        "box-shadow": ""
      });
    } else
      $(element).addClass('unhighlighted').removeClass('highlighted');
    App.DataStore.remove("highlightedElement");
    App.DataStore.remove("typeElement");
  }
};

function scrollToLayer(selectedValue) {
  var element = ("#collapsable_" + selectedValue);
  if (selectedValue == 'logout')
    setTimeout(function() {
      SessionController.logout();
    }, 50);
  else {
    triggerExpand($(element));
    scrollToHash(element);
  }
}

function scrollToHash(element) {
  if ($(element).length > 0)
    $(document.body).animate({
      'scrollTop': $(element).offset().top
    }, 800);
}

function triggerExpand(parent) {
  parent.find(".ui-collapsible-heading").
      removeClass("ui-collapsible-heading-collapsed");
  parent.find(".ui-collapsible-content").
      removeClass("ui-collapsible-content-collapsed");
  parent.find(".ui-collapsible-heading a").
      addClass("ui-icon-minus").removeClass("ui-icon-plus");
}