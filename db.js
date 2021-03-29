var { Connection, Request } = require("tedious");
var async = require('async');
//var { request } = require("./app");


// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "roboadmin", // update me
      password: "LILBTMCNETEW6cdd3wjhfd6e2gCDD3WJHFD6E2G4@" // update me
    },
    type: "default"
  },
  server: "notejam-tst-sql.database.windows.net", // update me
  options: {
    database: "notejam-tst-sql-db", //update me
    encrypt: true
  }
};

var connection = new Connection(config);
connection.connect()

var functions = {
  
    createTables: function(next) {
      async.series({
        createUsers: function(callback) {
            request = new Request("CREATE TABLE IF NOT EXISTS users (" +
              "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
              "email VARCHAR(75) NOT NULL," +
              "password VARCHAR(128) NOT NULL);",
              function() { callback(null); });

              connection.execSql(request);

              console.log("user table")
        },
        createPads: function(callback) {
          request = new Request("CREATE TABLE IF NOT EXISTS pads (" +
              "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
              "name VARCHAR(100) NOT NULL," +
              "user_id INTEGER NOT NULL REFERENCES users(id));",
              function() { callback(null); });

              connection.execSql(request);

              console.log("pads")
        },
        createNotes: function(callback) {
          request = new Request("CREATE TABLE IF NOT EXISTS notes (" +
              "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
              "pad_id INTEGER REFERENCES pads(id)," +
              "user_id INTEGER NOT NULL REFERENCES users(id)," +
              "name VARCHAR(100) NOT NULL," +
              "text text NOT NULL," +
              "created_at default current_timestamp," +
              "updated_at default current_timestamp);",
              function() { callback(null); });
              
              connection.execSql(request);
        }
      },
      function(err, results) {
        console.log(err)
        next();
      });
    },
  
    applyFixtures: function(next) {
      this.truncateTables(function() {
        async.series([
          function(callback) {
            request = new Request("INSERT INTO users VALUES (1, 'user1@example.com', " +
                   "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')",
                  function() { callback(null) });
                  connection.execSql(request);
          },
          function(callback) {
            request = new Request("INSERT INTO users VALUES (2, 'user2@example.com', " +
                   "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')",
                  function() { callback(null) });
                  connection.execSql(request);
  
          },
          function(callback) {
            request = new Request("INSERT INTO pads VALUES (1, 'Pad 1', 1)",
                  function() { callback(null) });
                  connection.execSql(request);
          },
          function(callback) {
            request = new Request("INSERT INTO pads VALUES (2, 'Pad 2', 1)",
                  function() { callback(null) });
                  connection.execSql(request);
          },
          function(callback) {
            request = new Request("INSERT INTO notes VALUES (1, 1, 1, 'Note 1', 'Text', 1, 1)",
                  function() { callback(null) });
                  connection.execSql(request);
          },
          function(callback) {
            request = new Request("INSERT INTO notes VALUES (2, 1, 1, 'Note 2', 'Text', 1, 1)",
                  function() { callback(null) });
                  connection.execSql(request);
          }
        ], function(err, results) {
          next();
        })
      });
    },
  
    truncateTables: function(next) {
      async.series([
        function(callback) {
          request = new Request("DELETE FROM users;",
                function() { callback(null) });
                connection.execSql(request);
        },
        function(callback) {
          request = new Request("DELETE FROM notes;",
                function() { callback(null) });
                connection.execSql(request);
  
        },
        function(callback) {
          request = new Request("DELETE FROM pads;",
                function(result) { callback(null); });
                connection.execSql(request);
        }
      ], function(err, results) {
        next();
      })
    }
  }
  
  
  if (require.main === module) {
    functions.createTables(function() {
      console.log("DB successfully initialized");
    });
  }
  console.log("exit")
  module.exports = functions;

