var CollectionView = {
  displayList: function (collectionData) {
    var content = App.Template.process("collection_list", collectionData);
    $('#collection-list').html(content);
    $('#collection-list').listview('refresh');
  },
  displayName: function (collectionName) {
    var content = App.Template.process("collection_name", collectionName)
    $('.title').html(content);
  }
};
