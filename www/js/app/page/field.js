$(function () {
  $(document).delegate('.skipLogicNumber', 'change', function () {
    SkipLogic.skipLogicNumber(this);
    NumberField.validateDecimal(this);
  });

  $(document).delegate('.validateSelectFields', 'change', function () {
    SkipLogic.skipLogicYesNo(this.id);
    ValidationHelper.validateSelectChange(this);
  });

  $(document).delegate('.ui-selectmenu', 'popupafterclose pagehide', function () {
    var start = this.id.search("-");
    var ele = this.id.substring(0, start);
    var element = $("#" + this.id);
    if (element.attr('data-is_enable_field_logic')) {
      if (element.attr('multiple'))
        SkipLogic.skipLogicSelectMany(element);
      else
        SkipLogic.skipLogicSelectOne(ele);
    }
  });

  $(document).delegate('#layer-list-menu-dialog, \n\
#update_layer-list-menu-dialog, \n\
#update_online_layer-list-menu-dialog', 'pagehide', function () {
    var idElement = this.id;
    var index = idElement.indexOf("-dialog");
    var ele = idElement.substr(0, index);
    scrollToLayer($('#' + ele).val());
  });

  $(document).delegate('#ui-btn-layer-menu, \n\
#ui-btn-layer-menu-update, \n\
#ui-btn-layer-menu-update-online', 'click', function () {
    var ele = $(this).children().children()[1].id;
    $("#" + ele).val("");
  });

  $(document).delegate("#page-create-site, \n\
#page-update-site, \n\
#page-update-site-online", "pageshow", function () {
    Location.page = 0;
    var cId = App.DataStore.get("cId");
    var members = [];
    MembershipOffline.fetchByCollectionId(cId, function (results) {
      results.forEach(function (result) {
        members.push({user_email: result.user_email()});
      });
    });

    $(document).delegate("#user_autocomplete", "filterablebeforefilter", function (e, data) {
      $(this).removeClass("ui-screen-hidden");
      UserFieldController.autoComplete(this, data, members);
    });

    $(document).delegate("#site_autocomplete", "filterablebeforefilter", function (e, data) {
      $(this).removeClass("ui-screen-hidden");
      SiteFieldController.autoComplete(this, data);
    });

    $(document).delegate("#user_autocomplete li", "click", function () {
      AutoCompleteList.getLi(this);
    });

    $(document).delegate("#site_autocomplete li", "click", function () {
      AutoCompleteList.getLi(this);
    });
  });

  $(document).delegate(".search_location", "focus", function () {
    FieldController.renderLocationField("#lat", "#lng", this.id, true);
  });

  $(document).delegate(".autocomplete li", "click", function () {
    if (this.id == "load_more_location") {
      Location.page++;
      var id = $(this).closest("ul").attr("data-input");
      id = id.substring(1, id.length);

      $("#load_more_location").remove();
      $(".autocomplete").listview("refresh");
      FieldController.renderLocationField("#lat", "#lng", id, false);
    } else {
      AutoCompleteList.getLi(this);
      $(".autocomplete").html("");
    }
  });

  $('body').click(function (event) {
    var yesNoField = App.DataStore.get("yesNoField");
    var otherField = $(event.target).attr("id");
    var highlightedElement = App.DataStore.get("highlightedElement");
    var typeElement = App.DataStore.get("typeElement");
    if (highlightedElement)
      if (("#") + otherField !== yesNoField && otherField) {
        SkipLogic.unhighlightElement(highlightedElement, typeElement);
        App.DataStore.remove("yesNoField");
      }
  });
});