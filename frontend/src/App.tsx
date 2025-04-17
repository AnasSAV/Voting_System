import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import AdminLogin from './components/AdminLogin';
import { api } from './services/api';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { isAdmin } = await api.checkAdminStatus();
        setIsAdmin(isAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await api.adminLogout();
      setIsAdmin(false);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleLogin = () => {
    setIsAdmin(true);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <div className="nav-logo">
            <Link to="/">
              <img src="/images/start.png" alt="App Logo" />
            </Link>
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"}>Vote</NavLink>
            {isAdmin && (
              <NavLink to="/results" className={({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"}>Results</NavLink>
            )}
            {isAdmin ? (
              <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
              <Link to="/login" className="login-button">Login</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
