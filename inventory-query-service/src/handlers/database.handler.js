const mysql = require('mysql');
const dbConfig = require("../" + process.env.DATABASE_CONFIG_LOCATION || "../../database_config.json")

//Sets configurable options for the mysql connection
let host;
if (process.env.DOCKER) host = `${dbConfig.baseSqlUrl}`
else host = `${dbConfig.localhostSqlUrl}`
let username = `${dbConfig.sqlUser}`
let database = 'inventory'


// Create a mysql connection pool
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : host,
  password        : process.env.MYSQL_PASSWORD,
  user            : username,
  database        : database
});

//Expose the connection pool to the world
module.exports = pool;
