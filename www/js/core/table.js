function createTables() {
  Collection = persistence.define('collections', {
    idcollection: "INT",
    name: "TEXT",
    description: "TEXT",
    is_visible_location: "BOOL",
    is_visible_name: "BOOL",
    user_id: "INT"
  });

  User = persistence.define('users', {
    email: "TEXT",
    password: "TEXT"
  });

  Site = persistence.define('sites', {
    idsite: "INT",
    name: "TEXT",
    lat: "INT",
    lng: "INT",
    created_at: "DATE",
    collection_id: "INT",
    collection_name: "TEXT",
    user_id: "INT",
    device_id: "TEXT",
    properties: "JSON",
    files: "JSON"
  });

  Field = persistence.define('fields', {
    collection_id: "INT",
    user_id: "INT",
    name_wrapper: "TEXT",
    id_wrapper: "INT",
    layer_membership: "JSON",
    fields: "JSON"
  });

  Membership = persistence.define('memberships', {
    collection_id: "INT",
    user_id: "INT",
    user_email: "TEXT",
    admin: "BOOL"
  });

//  persistence.defineMigration(1, {
//    up: function () {
//      this.createTable('Site', function (t) {
//        t.integer('idsite');
//        t.text('name');
//        t.integer('lat');
//        t.integer('lng');
//        t.date('created_at');
//        t.integer('collection_id');
//        t.text('collection_name');
//        t.integer('user_id');
//        t.text('device_id');
//        t.json('properties');
//        t.json('files');
//      });
//    },
//    down: function () {
//      this.dropTable('Site');
//    }
//  });
//
//  persistence.defineMigration(2, {
//    up: function () {
//      this.addColumn('Site', 'start_entry_date', 'TEXT');
//      this.addColumn('Site', 'end_entry_date', 'TEXT');
//      this.executeSql('UPDATE Site SET start_entry_date = ""');
//      this.executeSql('UPDATE Site SET end_entry_date = ""');
//    }
//  });
//  migrate();
//}



  persistence.defineMigration(1, {
    up: function () {
      this.addColumn('sites', 'start_entry_date', 'TEXT');
      this.addColumn('sites', 'end_entry_date', 'TEXT');
      this.executeSql('UPDATE sites SET start_entry_date = ""');
      this.executeSql('UPDATE sites SET end_entry_date = ""');
//      this.executeSql('DROP TABLE oldSites');
//      // rename current table
//      this.executeSql('ALTER TABLE sites RENAME TO oldSites');
//      // create new table with required columns
//      this.executeSql(
//          'CREATE TABLE IF NOT EXISTS sites (id VARCHAR(32) PRIMARY KEY, \n\
//idsite INT, name TEXT, lat INT, lng INT, created_at DATE, start_entry_date TEXT, \n\
//end_entry_date TEXT, collection_id INT, collection_name TEXT, user_id INT, \n\
//device_id TEXT,properties JSON, files JSON)');
//      // copy contents from old table to new table
//      this.executeSql('INSERT INTO sites(id, idsite, name, lat, lng, created_at, \n\
//start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
//properties , files) SELECT id, idsite, name, lat, lng, created_at, \n\
//start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
//properties , files FROM oldSites');
//      // delete current table
//      this.executeSql('DROP TABLE oldSites');
    },
    down: function () {
      this.removeColumn('sites', 'start_entry_date');
      this.removeColumn('sites', 'end_entry_date');
      this.executeSql('UPDATE sites SET start_entry_date = ""');
      this.executeSql('UPDATE sites SET end_entry_date = ""');
//      this.executeSql('DROP TABLE oldSites');
//      this.executeSql('ALTER TABLE sites RENAME TO oldSites');
//      this.executeSql(
//          'CREATE TABLE sites (id VARCHAR(32) PRIMARY KEY, \n\
//idsite INT, name TEXT, lat INT, lng INT, created_at DATE, start_entry_date TEXT, \n\
//end_entry_date TEXT, collection_id INT, collection_name TEXT, user_id INT, \n\
//device_id TEXT,properties JSON, files JSON)');
//      this.executeSql('INSERT INTO sites(id, idsite, name, lat, lng, created_at, \n\
//start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
//properties , files) SELECT id, idsite, name, lat, lng, created_at, \n\
//start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
//properties , files FROM oldSites');
//      this.executeSql('DROP TABLE oldSites');
    }
  });
  migrate();
}

function migrate() {
  console.log('migrating...');
  persistence.migrations.init(function () {
    console.log('migration init');
    persistence.migrate(function () {
      console.debug('migration complete!');
    });
  });
};