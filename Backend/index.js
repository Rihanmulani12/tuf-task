const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const db_URL = process.env.DB_URL;

// Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(db_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for code snippets
const codeSnippetSchema = new mongoose.Schema({
  username: String,
  language: String,
  stdin: String,
  code: String,
  timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

// Handle submission of code snippets
app.post('/submit', async (req, res) => {
  const { username, language, stdin, code } = req.body;
  if (!username || !language || !code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create a new code snippet instance
    const newSnippet = new CodeSnippet({ username, language, stdin, code });
    // Save the snippet to the database
    await newSnippet.save();
    res.status(200).json({ message: 'Code snippet submitted successfully' });
  } catch (error) {
    console.error('Error submitting code snippet:', error);
    res.status(500).json({ error: 'Error submitting code snippet' });
  }
});


// Fetch code snippets
app.get('/snippets', async (req, res) => {
  try {
    // Fetch all code snippets from the database
    const snippets = await CodeSnippet.find();
    res.status(200).json(snippets);
  } catch (error) {
    console.error('Error fetching code snippets:', error);
    res.status(500).json({ error: 'Error fetching code snippets' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Close the database connection when the server shuts down
process.on('SIGINT', () => {
  console.log('Server shutting down');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});