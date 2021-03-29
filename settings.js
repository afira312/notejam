var settings = {
  development: {
    db: "notejam.db",
    dsn: "sqlite://notejam.db"
  },
  test: {
    db: "notejam_test.db",
    dsn: "sqlite://notejam_test.db"
  },
  prod:{

    db: "notejam-tst-sql-db",
    dsn : "Server=tcp:notejam-tst-sql.database.windows.net,1433;Initial Catalog=notejam-tst-sql-db;Persist Security Info=False;User ID=roboadmin;Password=LILBTMCNETEW6cdd3wjhfd6e2gCDD3WJHFD6E2G4@;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
};


var env = process.env.NODE_ENV
if (!env) {
  env = 'prod'
};
module.exports = settings[env];
