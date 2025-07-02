import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TherapistPage.css';

const API_URL = 'http://localhost:3001/api';

function TherapistPage() {
  const [therapists, setTherapists] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    location: '',
    years_of_practice: '',
    availability: 'TAKING CLIENTS'
  });
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await axios.get(`${API_URL}/therapists`);
      setTherapists(response.data);
      setResponseMessage('Therapists loaded successfully');
    } catch (error) {
      console.error('Error fetching therapists:', error);
      setResponseMessage('Error loading therapists');
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
      const response = await axios.post(`${API_URL}/therapists`, formData);
      setTherapists([...therapists, response.data]);
      setFormData({
        title: '',
        name: '',
        email: '',
        location: '',
        years_of_practice: '',
        availability: 'TAKING CLIENTS'
      });
      setResponseMessage('Therapist created successfully');
    } catch (error) {
      console.error('Error creating therapist:', error);
      setResponseMessage('Error creating therapist');
    }
  };

  const handleSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setFormData({
      title: therapist.title,
      name: therapist.name,
      email: therapist.email,
      location: therapist.location,
      years_of_practice: therapist.years_of_practice,
      availability: therapist.availability
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTherapist) return;

    try {
      const response = await axios.put(`${API_URL}/therapists/${selectedTherapist.id}`, formData);
      setTherapists(therapists.map(therapist => 
        therapist.id === selectedTherapist.id ? { ...therapist, ...response.data } : therapist
      ));
      setFormData({
        title: '',
        name: '',
        email: '',
        location: '',
        years_of_practice: '',
        availability: 'TAKING CLIENTS'
      });
      setSelectedTherapist(null);
      setResponseMessage('Therapist updated successfully');
    } catch (error) {
      console.error('Error updating therapist:', error);
      setResponseMessage('Error updating therapist');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/therapists/${id}`);
      setTherapists(therapists.filter(therapist => therapist.id !== id));
      if (selectedTherapist && selectedTherapist.id === id) {
        setSelectedTherapist(null);
        setFormData({
          title: '',
          name: '',
          email: '',
          location: '',
          years_of_practice: '',
          availability: 'TAKING CLIENTS'
        });
      }
      setResponseMessage('Therapist deleted successfully');
    } catch (error) {
      console.error('Error deleting therapist:', error);
      setResponseMessage('Error deleting therapist');
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      name: '',
      email: '',
      location: '',
      years_of_practice: '',
      availability: 'TAKING CLIENTS'
    });
    setSelectedTherapist(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Therapists</h2>
      
      <div className="form-section">
        <h3>{selectedTherapist ? 'Edit Therapist' : 'Add New Therapist'}</h3>
        <form onSubmit={selectedTherapist ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
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
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="years_of_practice">Years of Practice:</label>
            <input
              type="number"
              id="years_of_practice"
              name="years_of_practice"
              value={formData.years_of_practice}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="availability">Availability:</label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
            >
              <option value="TAKING CLIENTS">Taking Clients</option>
              <option value="NOT TAKING CLIENTS">Not Taking Clients</option>
            </select>
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedTherapist ? 'Update Therapist' : 'Add Therapist'}
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
        <h3>Therapist List</h3>
        {therapists.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Years of Practice</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {therapists.map(therapist => (
                <tr key={therapist.id}>
                  <td>{therapist.id}</td>
                  <td>{therapist.title}</td>
                  <td>{therapist.name}</td>
                  <td>{therapist.email}</td>
                  <td>{therapist.location}</td>
                  <td>{therapist.years_of_practice}</td>
                  <td>{therapist.availability}</td>
                  <td>
                    <button onClick={() => handleSelect(therapist)}>Edit</button>
                    <button onClick={() => handleDelete(therapist.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No therapists found.</p>
        )}
      </div>
    </div>
  );
}

export default TherapistPage; 