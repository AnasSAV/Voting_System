import React, { useEffect, useState } from 'react';
import '../styles/ResultsPage.css';
import { api, VoteResult } from '../services/api';
import AdminLogin from './AdminLogin';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { isAdmin } = await api.checkAdminStatus();
        setIsAdmin(isAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchResults();
    }
  }, [isAdmin]);


  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getResults();
      const formattedResults = Object.entries(data.votes).map(([teamName, count]) => ({
        team_name: teamName,
        count: count as number
      })).sort((a, b) => b.count - a.count);
      setResults(formattedResults);
    } catch (err) {
      setError('Failed to load results. Please try again later.');
      console.error('Error fetching results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    fetchResults();
  };

  const getRowClassName = (index: number) => {
    switch (index) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
      default:
        return 'light-blue';
    }
  };

  const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

  const generatePDF = async () => {
    const element = document.getElementById('leaderboard-container');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('voting-leaderboard.pdf');
  };

  if (isCheckingAuth) {
    return <div className="results-container">Loading...</div>;
  }

  if (!isAdmin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div className="results-container">
      <div className="header">
        <h1>TECHNO 2024</h1>
      </div>

      <div className="start">
        <img src="/images/start.png" alt="TECHNO 2024" />
      </div>

      <div id="leaderboard-container" className="leaderboard-container">
        <h1>Voting Leaderboard</h1>

        {isLoading ? (
          <p>Loading results...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : totalVotes > 0 ? (
          <>
            <p>Total Votes: {totalVotes}</p>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team Name</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.team_name} className={getRowClassName(index)}>
                    <td>{index + 1}</td>
                    <td>{result.team_name}</td>
                    <td>{result.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="no-votes">No votes have been cast yet.</p>
        )}
      </div>

      <button onClick={generatePDF} className="generate-pdf-button">
        Download Report
      </button>

      <div className="footer">
        <img src="/images/IESL.png" alt="IESL Logo" />
      </div>
    </div>
  );
};

export default ResultsPage;