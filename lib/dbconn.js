var mysql        = require('mysql');
var connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : "localhost",
  user     : "root",
  password : "root",
  database : "biblioteca"
});

module.exports = connection;
