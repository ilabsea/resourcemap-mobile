var AutoComplete = {
  display: function (templateURL, element, data) {
    var content = App.Template.process(templateName, data);
    element.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
    element.listview("refresh");
    element.html(content);
    element.listview("refresh");
    element.trigger("updatelayout");
  }
};
