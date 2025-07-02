const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Import routes
const therapistRoutes = require("./routes/therapistRoutes");
const clientRoutes = require("./routes/clientRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

// Create Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const connection = mysql.createConnection({
  host: "webcourse.cs.nuim.ie",
  user: "u240209",
  password: "Uey9ooth0phee0ah", // actual database password when running
  database: "cs230_u240209"
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
    return;
  }
  console.log("Connected to MySQL database");
  
  // Set up database tables on server start
  setupDatabase();
});

// Make the connection available globally
global.connection = connection;

// Function to set up database tables
function setupDatabase() {
  try {
    // Read SQL file
    const sqlScript = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
    
    // Split SQL script into individual statements
    const statements = sqlScript.split(';').filter(statement => statement.trim() !== '');
    
    // Execute each statement
    statements.forEach(statement => {
      connection.query(statement, (err, results) => {
        if (err) {
          console.error(`Error executing SQL: ${statement.substring(0, 50)}...`);
          console.error(err);
        } else {
          console.log(`Successfully executed: ${statement.substring(0, 50)}...`);
        }
      });
    });
    
    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

// Use routes
app.use("/api/therapists", therapistRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/sessions", sessionRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Therapy Management API is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 