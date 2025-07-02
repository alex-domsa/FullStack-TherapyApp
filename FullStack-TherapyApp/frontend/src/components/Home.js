import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="page-container">
      <h2 className="section-title">Welcome to Therapy Management System</h2>
      
      <div className="home-sections">
        <div className="home-section">
          <h3>Therapists</h3>
          <p>View, add, edit, and delete therapist information. Manage therapist details including title, name, email, location, years of practice, and availability.</p>
          <Link to="/therapists">
            <button>Go to Therapists</button>
          </Link>
        </div>
        
        <div className="home-section">
          <h3>Clients</h3>
          <p>Manage client information. Add new clients, update existing ones, or remove clients from the system.</p>
          <Link to="/clients">
            <button>Go to Clients</button>
          </Link>
        </div>
        
        <div className="home-section">
          <h3>Sessions</h3>
          <p>Organize and manage therapy sessions. Schedule new sessions, update session details, or remove sessions from the calendar.</p>
          <Link to="/sessions">
            <button>Go to Sessions</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 