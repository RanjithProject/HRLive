// const {Client}=require('pg');

// const connection=new Client({
//     host:'localhost',
//     user:'postgres',
//     port:5432,
//     password:'devwemo',
//     database:'HRPORTAL',
// });

// connection.connect().then(()=>
// console.log("postgresql connected successfully")
// ).catch((err)=>
// console.log("connection error : ",err)
// );





const { Client } = require('pg');

const connection = new Client({
    // host: 'localhost',
    // user: 'postgres',
    // port: 5432,
    // password: 'devwemo',
    // database: 'HRPORTAL',
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'devwemo',
    database: 'HRPORTAL',
});

connection.connect()
    .then(() => console.log("PostgreSQL connected successfully"))
    .catch((err) => console.log("Connection error:", err));

// Export the connection object directly
module.exports = connection;
