import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import TherapistPage from './components/Therapist/TherapistPage';
import ClientPage from './components/Client/ClientPage';
import SessionPage from './components/Session/SessionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Alex's Therapy Management System</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/therapists">Therapists</Link></li>
              <li><Link to="/clients">Clients</Link></li>
              <li><Link to="/sessions">Sessions</Link></li>
            </ul>
          </nav>
        </header>
        
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/therapists" element={<TherapistPage />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/sessions" element={<SessionPage />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>&copy; 06/04/2025 all rights reserved to Alex Domsa 23389313 ;) </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
