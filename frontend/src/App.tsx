import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <Link to="/" className="nav-link">Vote</Link>
          <Link to="/results" className="nav-link">Results</Link>
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
