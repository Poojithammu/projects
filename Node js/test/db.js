const { createPool } = require('mysql2');

const db = createPool({
    host: 'localhost',
    user: 'root',
    password: '@Harsha2004',
    database: 'FeedBack'
});

db.query("SELECT * FROM user_details", (err, results, fields) => {
    if (err) {
        console.error("Error executing query:", err);
        return;
    }
    console.log("Query successful:", results);
});
