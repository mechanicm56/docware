import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <div className="p-4 border-b mb-4">
          <Link to="/">Dashboard</Link>
        </div>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default App;
