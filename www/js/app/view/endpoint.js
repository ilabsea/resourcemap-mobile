EndPointView = {
  display: function (element, url) {
    var content = App.Template.process("endpoint", url)
    element.html(content);
  }
};
