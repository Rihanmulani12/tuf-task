const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config()


const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


// Handle submission of code snippets
app.post('/submit', (req, res) => {
  const { username, language, stdin, code } = req.body;
  if (!username || !language || !code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const timestamp = new Date();
  const limitedCode = code.slice(0, 100);

  const sql = 'INSERT INTO code_snippets (username, language, stdin, code, timestamp) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [username, language, stdin, code, timestamp], (err, result) => {
    if (err) {
      console.error('Error submitting code snippet:', err);
      return res.status(500).json({ error: 'Error submitting code snippet' });
    }
    res.status(200).json({ message: 'Code snippet submitted successfully' });
  });
});

// Fetch code snippets
app.get('/snippets', (req, res) => {
  const sql = 'SELECT username, language, stdin, SUBSTRING(code, 1, 100) AS codeSnippet, timestamp FROM code_snippets';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching code snippets:', err);
      return res.status(500).json({ error: 'Error fetching code snippets' });
    }
    res.status(200).json(results);
  });
});

// Close the database connection when the server shuts down
process.on('SIGINT', () => {
  console.log('Server shutting down');
  db.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection:', err);
    }
    console.log('MySQL connection closed');
    process.exit(0);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
