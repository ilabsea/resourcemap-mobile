EndPointView = {
  display: function (element, url) {
    App.Template.process("endpoint.html", url, function (content) {
      element.html(content);
    });
  }
};