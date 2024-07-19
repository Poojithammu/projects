const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const url = require('url')

const app = express();
const port = 3000;

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); 

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Harsha2004',
  database: 'FeedBack'
});

db.connect((err) => {
  if (err) {
    return console.log("error");
  }
  console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/register', (req, res) => {
  const { email, mobileno, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('<h3>Passwords do not match. Please try again.</h3>');
  }

  const sql = 'INSERT INTO user_details (email, mobileno, password) VALUES (?, ?, ?)';
  const values = [email, mobileno, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.send('<h3>Database error: ' + err.message + '</h3>');
    }
    res.send('<h3>Registration successful!</h3>');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
