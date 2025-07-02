-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS therapists;

-- Create therapists table
CREATE TABLE therapists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  years_of_practice INT NOT NULL,
  availability ENUM('TAKING CLIENTS', 'NOT TAKING CLIENTS') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clients table
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  appointment_regularity ENUM('WEEKLY', 'MONTHLY') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  therapist_id INT NOT NULL,
  client_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INT NOT NULL, -- in minutes
  status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Insert sample data for therapists
INSERT INTO therapists (title, name, email, location, years_of_practice, availability) VALUES
('Dr.', 'Sarah Johnson', 'sarah.johnson@therapy.com', 'Dublin', 15, 'TAKING CLIENTS'),
('Dr.', 'Michael Brown', 'michael.brown@therapy.com', 'Cork', 8, 'NOT TAKING CLIENTS'),
('Dr.', 'Emily Davis', 'emily.davis@therapy.com', 'Galway', 12, 'TAKING CLIENTS');

-- Insert sample data for clients
INSERT INTO clients (name, email, phone_number, appointment_regularity) VALUES
('John Smith', 'john.smith@email.com', '+353123456789', 'WEEKLY'),
('Mary Wilson', 'mary.wilson@email.com', '+353987654321', 'MONTHLY'),
('David Lee', 'david.lee@email.com', '+353456789123', 'WEEKLY');

-- Insert sample data for sessions
INSERT INTO sessions (therapist_id, client_id, date, time, duration, status, notes) VALUES
(1, 1, '2024-03-20', '10:00:00', 60, 'COMPLETED', 'Initial consultation and assessment'),
(1, 2, '2024-03-21', '14:00:00', 45, 'SCHEDULED', 'Regular therapy session'),
(3, 3, '2024-03-22', '11:00:00', 60, 'SCHEDULED', 'Progress review and discussion'); 