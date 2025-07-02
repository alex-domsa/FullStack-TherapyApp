// Therapist Controller - CRUD Operations

// Get all therapists
exports.getAllTherapists = (req, res) => {
  const { query } = req.query;
  let sqlQuery = "SELECT * FROM therapists";
  
  if (query) {
    sqlQuery += ` WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' OR location LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching therapists: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get therapist by ID
exports.getTherapistById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM therapists WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching therapist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    
    res.status(200).json(results[0]);
  });
};

// Create a new therapist
exports.createTherapist = (req, res) => {
  const { title, name, email, location, years_of_practice, availability } = req.body;
  
  if (!title || !name || !email || !location || !years_of_practice || !availability) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "INSERT INTO therapists (title, name, email, location, years_of_practice, availability) VALUES (?, ?, ?, ?, ?, ?)";
  
  connection.query(query, [title, name, email, location, years_of_practice, availability], (err, results) => {
    if (err) {
      console.error("Error creating therapist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      title,
      name,
      email,
      location,
      years_of_practice,
      availability
    });
  });
};

// Update a therapist
exports.updateTherapist = (req, res) => {
  const { id } = req.params;
  const { title, name, email, location, years_of_practice, availability } = req.body;
  
  if (!title && !name && !email && !location && !years_of_practice && !availability) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE therapists SET ";
  const queryParams = [];
  
  if (title) {
    query += "title = ?, ";
    queryParams.push(title);
  }
  
  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  
  if (email) {
    query += "email = ?, ";
    queryParams.push(email);
  }
  
  if (location) {
    query += "location = ?, ";
    queryParams.push(location);
  }
  
  if (years_of_practice) {
    query += "years_of_practice = ?, ";
    queryParams.push(years_of_practice);
  }
  
  if (availability) {
    query += "availability = ?, ";
    queryParams.push(availability);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating therapist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete a therapist
exports.deleteTherapist = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM therapists WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting therapist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    
    res.status(200).json({ message: "Therapist deleted successfully" });
  });
}; 