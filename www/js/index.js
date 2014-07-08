URL = "http://192.168.1.92:3000/",
        END_POINT = URL + "api",
        window.App = {
            DB_SIZE: 5 * 1024 * 1024,
            DB_NAME: 'resourcemap_db',
            END_POINT: END_POINT,
            IMG_PATH: URL + "photo_field/",
            AUTH_URL: END_POINT + "/users/sign_in.json",
            LIST_COLLECTION: END_POINT + "/collections?auth_token=",
            URL_SIGNUP: END_POINT + "/users.json",
            URL_LOGOUT: END_POINT + "/users/sign_out.json?auth_token=",
            URL_FIELDNOV: END_POINT + "/collections/",
            URL_SITE: END_POINT + "/v1/collections/",
            URL_FIELD:  END_POINT + "/v1/collections/",
            DEBUG: true,
            userId: "",
            log: function(obj) {
                if (App.DEBUG)
                    console.log(obj);
            },
            initialize: function() {
                this.setUp();
                this.bindEvents();
            },
            resetDb: function() {
                persistence.reset();
                persistence.schemaSync();
            },
            bindEvents: function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            onDeviceReady: function() {
                App.receivedEvent('deviceready');
                connectionDB(App.DB_NAME, App.DB_SIZE);
                createTables();
            },
            receivedEvent: function(id) {
                console.log('Received Event: ' + id);
            },
            emptyHTML: function() {
                $(".clearPreviousDisplay").html("");
            },
            setUp: function() {
                $.ajaxSetup({
                    crossDomain: true,
                    complete: function() {
                        ViewBinding.setBusy(false);
                    }
                });
            }
        };
