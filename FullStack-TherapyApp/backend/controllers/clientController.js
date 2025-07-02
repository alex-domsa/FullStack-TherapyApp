// Client Controller - CRUD Operations

// Get all clients
exports.getAllClients = (req, res) => {
  const { query } = req.query;
  let sqlQuery = "SELECT * FROM clients";
  
  if (query) {
    sqlQuery += ` WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' OR phone_number LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching clients: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get client by ID
exports.getClientById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM clients WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching client: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json(results[0]);
  });
};

// Create a new client
exports.createClient = (req, res) => {
  const { name, email, phone_number, appointment_regularity } = req.body;
  
  if (!name || !email || !phone_number || !appointment_regularity) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "INSERT INTO clients (name, email, phone_number, appointment_regularity) VALUES (?, ?, ?, ?)";
  
  connection.query(query, [name, email, phone_number, appointment_regularity], (err, results) => {
    if (err) {
      console.error("Error creating client: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      name,
      email,
      phone_number,
      appointment_regularity
    });
  });
};

// Update a client
exports.updateClient = (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number, appointment_regularity } = req.body;
  
  if (!name && !email && !phone_number && !appointment_regularity) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE clients SET ";
  const queryParams = [];
  
  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  
  if (email) {
    query += "email = ?, ";
    queryParams.push(email);
  }
  
  if (phone_number) {
    query += "phone_number = ?, ";
    queryParams.push(phone_number);
  }
  
  if (appointment_regularity) {
    query += "appointment_regularity = ?, ";
    queryParams.push(appointment_regularity);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating client: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete a client
exports.deleteClient = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM clients WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting client: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json({ message: "Client deleted successfully" });
  });
}; 