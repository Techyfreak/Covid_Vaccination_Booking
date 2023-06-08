const mysql = require('mysql2');// initialize mysql
const db = mysql.createConnection({
	host: "bqeeflytzfdq4etvjce8-mysql.services.clever-cloud.com",
	database: "bqeeflytzfdq4etvjce8",
	user:"uxxvsyorq9cxbyw8" ,
	password:"v7f1R8DeSbxzZ5J2w9TQ" ,
	
});

db.connect((err) => { //connecting with cloud
	if (!err) {
		console.log('MySQL is connected');
	} else {
		console.log('MySQL failed to connect');
		console.log(err);
	}
});

module.exports = db;