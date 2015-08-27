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

  persistence.defineMigration(1, {
    up: function () {
      this.addColumn('sites', 'start_entry_date', 'TEXT');
      this.addColumn('sites', 'end_entry_date', 'TEXT');
      this.executeSql('UPDATE sites SET start_entry_date = ""');
      this.executeSql('UPDATE sites SET end_entry_date = ""');
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
}
;