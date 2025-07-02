// Session Controller - CRUD Operations

// Get all sessions
exports.getAllSessions = (req, res) => {
  const { query } = req.query;
  let sqlQuery = `
    SELECT 
      sessions.*,
      CONCAT(therapists.title, ' ', therapists.name) as therapist_name,
      clients.name as client_name
    FROM sessions
    LEFT JOIN therapists ON sessions.therapist_id = therapists.id
    LEFT JOIN clients ON sessions.client_id = clients.id
  `;
  
  if (query) {
    sqlQuery += ` WHERE sessions.notes LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching sessions: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get session by ID
exports.getSessionById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      sessions.*,
      CONCAT(therapists.title, ' ', therapists.name) as therapist_name,
      clients.name as client_name
    FROM sessions
    LEFT JOIN therapists ON sessions.therapist_id = therapists.id
    LEFT JOIN clients ON sessions.client_id = clients.id
    WHERE sessions.id = ?
  `;
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching session: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(results[0]);
  });
};

// Create a new session
exports.createSession = (req, res) => {
  const { therapist_id, client_id, date, time, duration, status, notes } = req.body;
  
  if (!therapist_id || !client_id || !date || !time || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const insertQuery = "INSERT INTO sessions (therapist_id, client_id, date, time, duration, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
  connection.query(insertQuery, [therapist_id, client_id, date, time, duration, status, notes], (err, results) => {
    if (err) {
      console.error("Error creating session: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    // After inserting, fetch the complete session with names
    const selectQuery = `
      SELECT 
        sessions.*,
        CONCAT(therapists.title, ' ', therapists.name) as therapist_name,
        clients.name as client_name
      FROM sessions
      LEFT JOIN therapists ON sessions.therapist_id = therapists.id
      LEFT JOIN clients ON sessions.client_id = clients.id
      WHERE sessions.id = ?
    `;
    
    connection.query(selectQuery, [results.insertId], (err, sessionResults) => {
      if (err) {
        console.error("Error fetching created session: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      res.status(201).json(sessionResults[0]);
    });
  });
};

// Update a session
exports.updateSession = (req, res) => {
  const { id } = req.params;
  const { therapist_id, client_id, notes, date, length } = req.body;
  
  if (!therapist_id && !client_id && !notes && !date && !length) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE sessions SET ";
  const queryParams = [];
  
  if (therapist_id) {
    query += "therapist_id = ?, ";
    queryParams.push(therapist_id);
  }
  
  if (client_id) {
    query += "client_id = ?, ";
    queryParams.push(client_id);
  }
  
  if (notes) {
    query += "notes = ?, ";
    queryParams.push(notes);
  }
  
  if (date) {
    query += "date = ?, ";
    queryParams.push(date);
  }
  
  if (length) {
    query += "length = ?, ";
    queryParams.push(length);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating session: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete a session
exports.deleteSession = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM sessions WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting session: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json({ message: "Session deleted successfully" });
  });
}; 