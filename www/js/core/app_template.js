App = App || {};
App.Template = {
  process: function(templateName, templateData) {
    var content = AppHandlebars.templates[templateName](templateData);
    return content;
  }
};
