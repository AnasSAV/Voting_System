import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
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
            <NavLink to="/results" className={({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"}>Results</NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
