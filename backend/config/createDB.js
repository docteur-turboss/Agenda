const mysql = require("mysql2");
require('dotenv').config({path : './config/.env'});

//crée une connexion à la db.
const con = mysql.createConnection({
    host: process.env.HOSTDB,
    port: process.env.PORTDB,
    user: process.env.USERDB,
    database : process.env.DATABASE,
    password : process.env.PASSWORDDB
});

console.log("Connection à la db...")
con.connect((err)=>{
  if(err) throw err;
  console.log("Connection réussi.")

  let SQL = "CREATE TABLE organisation"
  SQL += "(ID INT NOT NULL AUTO_INCREMENT, Nom VARCHAR(255) NOT NULL, type INT NOT NULL, PRIMARY KEY (ID)) "

  Query(SQL, "organisation", 'table')

  SQL = "CREATE TABLE category_event ( "
  SQL += "id INT NOT NULL AUTO_INCREMENT,  "
  SQL += "Name VARCHAR(255) NOT NULL,  "
  SQL += "color VARCHAR(45) NOT NULL,  "
  SQL += "Organisation_ID INT NOT NULL,  "
  SQL += "PRIMARY KEY (id),  "
  SQL += "CONSTRAINT fk_category_event_organisation2  "
  SQL += "FOREIGN KEY (Organisation_ID) REFERENCES organisation (ID)  "
  SQL += "ON DELETE NO ACTION  "
  SQL += "ON UPDATE NO ACTION) "

  Query(SQL, "category_event", 'table')
  
  SQL = "CREATE INDEX fk_category_event_organisation2_idx ON category_event (Organisation_ID ASC) VISIBLE "

  Query(SQL, "category_event ", 'index')

  SQL =  "CREATE TABLE User ( " +
  "ID INT NOT NULL AUTO_INCREMENT, " +
  "Pseudo VARCHAR(45) NOT NULL, " +
  "Email VARCHAR(255) NOT NULL, " +
  "password VARCHAR(255) NOT NULL, " +
  "Type VARCHAR(45) NOT NULL, " +
  "join_date DATETIME NULL, " +
  "token TEXT NULL, " +
  "CookieSecure TEXT NULL, " +
  "PRIMARY KEY (ID)) "

  Query(SQL,  "user ", 'table')

  SQL = "CREATE TABLE user_has_organisation ( "+
  "ID INT NOT NULL AUTO_INCREMENT, " +
  "User_ID INT NOT NULL, " +
  "Organisation_ID INT NOT NULL, " +
  "Permission VARCHAR(255) NOT NULL, " +
  "PRIMARY KEY (ID), " +
  "CONSTRAINT fk_user_has_organisation_User1 " +
  "FOREIGN KEY (User_ID) " +
  "REFERENCES User (ID) " +
  "ON DELETE NO ACTION " +
  "ON UPDATE NO ACTION, " +
  "CONSTRAINT fk_user_has_organisation_organisation1 " +
  "FOREIGN KEY (Organisation_ID) " +
  "REFERENCES organisation (ID) " +
  "ON DELETE NO ACTION " +
  "ON UPDATE NO ACTION) "

  Query(SQL, "user_has_organisation", 'table')

  SQL = "CREATE INDEX fk_user_has_organisation_User1_idx ON user_has_organisation (User_ID ASC) VISIBLE; "

  Query(SQL, "user_has_organisation", 'index')

  SQL = "CREATE INDEX fk_user_has_organisation_organisation1_idx ON user_has_organisation (Organisation_ID ASC) VISIBLE; "

  Query(SQL, "user_has_organisation", "index")

  SQL = "CREATE TABLE task_event ( " +
  "ID INT NOT NULL AUTO_INCREMENT, " +
  "OuCA VARCHAR(45) NULL, " +
  "Datetime VARCHAR(45) NOT NULL, " +
  "Organisation_ID INT NOT NULL, " +
  "category_event_ID INT NOT NULL, " +
  "name VARCHAR(255) NULL, " +
  "PRIMARY KEY (ID), " +
  "CONSTRAINT fk_category_event_category_event " +
  "FOREIGN KEY (category_event_ID) " +
  "REFERENCES category_event (id) " +
  "ON DELETE NO ACTION " +
  "ON UPDATE NO ACTION, " +
  "CONSTRAINT fk_category_event_organisation1 " +
  "FOREIGN KEY (Organisation_ID) " +
  "REFERENCES organisation (ID) " +
  "ON DELETE NO ACTION " +
  "ON UPDATE NO ACTION) "

  Query(SQL, "task_event ", "table")

  SQL =  "CREATE INDEX fk_category_event_category_event_idx ON task_event (category_event_ID ASC) VISIBLE; "

  Query(SQL, "task_event", "index")

  SQL = "CREATE INDEX fk_category_event_organisation1_idx ON task_event (Organisation_ID ASC) VISIBLE; "

  Query(SQL, "task_event ", "index")

  console.log("Database created")
  console.log("deconnection à la db")

  con.end((err) =>{
    if(err) throw err;
    console.log("Database déconnecté.")
  })
})

let Query = (sqlQuery, table, type) => {
  con.query(sqlQuery, (err) =>{
    if(err) throw err;
  })
}