var mysql = require("mysql2");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydB",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // ----------------- CREATE_DATABASE_QUERY -------------------
  // con.query("CREATE DATABASE mydb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });

  // ----------------- CREATE_DATABASE_QUERY -------------------

  // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });

  // ----------------- INSERT_INTO_DATA_QUERY -------------------

  // var sql =
  //   "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });

  // ----------------- INSERT_INTO_MULTIIPLE_DATA_QUERY -------------------
  // var sql = "INSERT INTO customers (name, address) VALUES ?";
  // var values = [
  //   ["John", "Highway 71"],
  //   ["Peter", "Lowstreet 4"],
  //   ["Amy", "Apple st 652"],
  //   ["Hannah", "Mountain 21"],
  //   ["Michael", "Valley 345"],
  //   ["Sandy", "Ocean blvd 2"],
  //   ["Betty", "Green Grass 1"],
  //   ["Richard", "Sky st 331"],
  //   ["Susan", "One way 98"],
  //   ["Vicky", "Yellow Garden 2"],
  //   ["Ben", "Park Lane 38"],
  //   ["William", "Central st 954"],
  //   ["Chuck", "Main Road 989"],
  //   ["Viola", "Sideway 1633"],
  // ];
  // con.query(sql, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records inserted: " + result.affectedRows);
  // });

  //--------------------- SELECT_ALL_DATA --------------------------
  // con.query("SELECT * FROM customers", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  //---------------------- SELECT_DATA_FROM -------------------------
  // con.query(
  //   "SELECT * FROM customers WHERE address = 'Park Lane 38'",
  //   function (err, result) {
  //     if (err) throw err;
  //     console.log(result);
  //   });

  //-------------------------- ORDER_BY_ACES------------------------
  // con.query("SELECT * FROM customers ORDER BY name", function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  //-------------------------- ORDER_BY_DESC------------------------
  // con.query(
  //   "SELECT * FROM customers ORDER BY name DESC",
  //   function (err, result) {
  //     if (err) throw err;
  //     console.log(result);
  //   });
  //---------------------------  DELETE_RECORD -----------------------
  // var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records deleted: " + result.affectedRows);
  // });

  //---------------------------- TABLE_DROP --------------------------
  // var sql = "DROP TABLE customers";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table deleted");
  // });

  //-------------------------- UPDATE_TABLE --------------------------
  // var sql =
  //   "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  //--------------------------- TABLE_LIMIT -------------------------
  // var sql = "SELECT * FROM customers LIMIT 5";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  //-------------------- TABLE_LIMIT_POSITION --------------------
  // var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var sql = "SELECT * FROM customers LIMIT 5, 2";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });
});
