import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SessionPage.css';

const API_URL = 'http://localhost:3001/api';

function SessionPage() {
  const [sessions, setSessions] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    therapist_id: '',
    client_id: '',
    date: '',
    time: '',
    duration: '60',
    status: 'SCHEDULED',
    notes: ''
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
    fetchClients();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`);
      setSessions(response.data);
      setResponseMessage('Sessions loaded successfully');
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setResponseMessage('Error loading sessions');
    }
  };

  const fetchTherapists = async () => {
    try {
      const response = await axios.get(`${API_URL}/therapists`);
      setTherapists(response.data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
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
      const response = await axios.post(`${API_URL}/sessions`, formData);
      setSessions([...sessions, response.data]);
      setFormData({
        therapist_id: '',
        client_id: '',
        date: '',
        time: '',
        duration: '60',
        status: 'SCHEDULED',
        notes: ''
      });
      setResponseMessage('Session created successfully');
    } catch (error) {
      console.error('Error creating session:', error);
      setResponseMessage('Error creating session');
    }
  };

  const handleSelect = (session) => {
    setSelectedSession(session);
    setFormData({
      therapist_id: session.therapist_id,
      client_id: session.client_id,
      date: session.date,
      time: session.time,
      duration: session.duration,
      status: session.status,
      notes: session.notes
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;

    try {
      const response = await axios.put(`${API_URL}/sessions/${selectedSession.id}`, formData);
      setSessions(sessions.map(session => 
        session.id === selectedSession.id ? { ...session, ...response.data } : session
      ));
      setFormData({
        therapist_id: '',
        client_id: '',
        date: '',
        time: '',
        duration: '60',
        status: 'SCHEDULED',
        notes: ''
      });
      setSelectedSession(null);
      setResponseMessage('Session updated successfully');
    } catch (error) {
      console.error('Error updating session:', error);
      setResponseMessage('Error updating session');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/sessions/${id}`);
      setSessions(sessions.filter(session => session.id !== id));
      if (selectedSession && selectedSession.id === id) {
        setSelectedSession(null);
        setFormData({
          therapist_id: '',
          client_id: '',
          date: '',
          time: '',
          duration: '60',
          status: 'SCHEDULED',
          notes: ''
        });
      }
      setResponseMessage('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      setResponseMessage('Error deleting session');
    }
  };

  const handleClear = () => {
    setFormData({
      therapist_id: '',
      client_id: '',
      date: '',
      time: '',
      duration: '60',
      status: 'SCHEDULED',
      notes: ''
    });
    setSelectedSession(null);
  };

  const getTherapistName = (id) => {
    const therapist = therapists.find(t => t.id === id);
    return therapist ? `${therapist.title} ${therapist.name}` : 'Unknown';
  };

  const getClientName = (id) => {
    const client = clients.find(c => c.id === id);
    return client ? client.name : 'Unknown';
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Sessions</h2>
      
      <div className="form-section">
        <h3>{selectedSession ? 'Edit Session' : 'Add New Session'}</h3>
        <form onSubmit={selectedSession ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="therapist_id">Therapist:</label>
            <select
              id="therapist_id"
              name="therapist_id"
              value={formData.therapist_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a therapist</option>
              {therapists.map(therapist => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.title} {therapist.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="client_id">Client:</label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes):</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedSession ? 'Update Session' : 'Add Session'}
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
        <h3>Session List</h3>
        {sessions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Therapist</th>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>{session.id}</td>
                  <td>{getTherapistName(session.therapist_id)}</td>
                  <td>{getClientName(session.client_id)}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
                  <td>{session.duration} minutes</td>
                  <td>{session.status}</td>
                  <td>
                    <button onClick={() => handleSelect(session)}>Edit</button>
                    <button onClick={() => handleDelete(session.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sessions found.</p>
        )}
      </div>
    </div>
  );
}

export default SessionPage; 