import React from 'react';
import '../styles/ResultsPage.css';

interface VoteResult {
  teamName: string;
  votes: number;
}

const ResultsPage: React.FC = () => {
  // Mock data for now - will be replaced with actual data when backend is connected
  const mockResults: VoteResult[] = [
    { teamName: 'MushRu', votes: 0 },
    { teamName: 'Rycycle', votes: 0 },
    { teamName: 'PetClicks', votes: 0 },
    { teamName: 'Brainiacs', votes: 0 },
    { teamName: 'TropiSip', votes: 0 },
  ].sort((a, b) => b.votes - a.votes);

  const totalVotes = mockResults.reduce((sum, result) => sum + result.votes, 0);

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

  return (
    <div className="results-container">
      <div className="header">
        <h1>TECHNO 2024</h1>
      </div>

      <div className="start">
        <img src="/images/start.png" alt="TECHNO 2024" />
      </div>

      <div className="leaderboard-container">
        <h1>Voting Leaderboard</h1>

        {totalVotes > 0 ? (
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
                {mockResults.map((result, index) => (
                  <tr key={result.teamName} className={getRowClassName(index)}>
                    <td>{index + 1}</td>
                    <td>{result.teamName}</td>
                    <td>{result.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="no-votes">No votes have been cast yet.</p>
        )}
      </div>

      <div className="footer">
        <img src="/images/IESL.png" alt="IESL Logo" />
      </div>
    </div>
  );
};

export default ResultsPage; 