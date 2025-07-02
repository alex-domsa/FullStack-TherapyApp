import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientPage.css';

const API_URL = 'http://localhost:3001/api';

function ClientPage() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    appointment_regularity: 'WEEKLY'
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
      setResponseMessage('Clients loaded successfully');
    } catch (error) {
      console.error('Error fetching clients:', error);
      setResponseMessage('Error loading clients');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/clients`, formData);
      setClients([...clients, response.data]);
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        appointment_regularity: 'WEEKLY'
      });
      setResponseMessage('Client created successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      setResponseMessage('Error creating client');
    }
  };

  const handleSelect = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone_number: client.phone_number,
      appointment_regularity: client.appointment_regularity
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const response = await axios.put(`${API_URL}/clients/${selectedClient.id}`, formData);
      setClients(clients.map(client => 
        client.id === selectedClient.id ? { ...client, ...response.data } : client
      ));
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        appointment_regularity: 'WEEKLY'
      });
      setSelectedClient(null);
      setResponseMessage('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      setResponseMessage('Error updating client');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/clients/${id}`);
      setClients(clients.filter(client => client.id !== id));
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient(null);
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          appointment_regularity: 'WEEKLY'
        });
      }
      setResponseMessage('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      setResponseMessage('Error deleting client');
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      appointment_regularity: 'WEEKLY'
    });
    setSelectedClient(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Clients</h2>
      
      <div className="form-section">
        <h3>{selectedClient ? 'Edit Client' : 'Add New Client'}</h3>
        <form onSubmit={selectedClient ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="appointment_regularity">Appointment Regularity:</label>
            <select
              id="appointment_regularity"
              name="appointment_regularity"
              value={formData.appointment_regularity}
              onChange={handleInputChange}
              required
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedClient ? 'Update Client' : 'Add Client'}
            </button>
            <button type="button" onClick={handleClear}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
      
      {responseMessage && (
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      )}
      
      <div className="table-section">
        <h3>Client List</h3>
        {clients.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Appointment Regularity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone_number}</td>
                  <td>{client.appointment_regularity}</td>
                  <td>
                    <button onClick={() => handleSelect(client)}>Edit</button>
                    <button onClick={() => handleDelete(client.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No clients found.</p>
        )}
      </div>
    </div>
  );
}

export default ClientPage; 