import React, { useState } from 'react';
import '../styles/VotingPage.css';
import { api } from '../services/api';

interface Team {
  id: number;
  name: string;
  image: string;
}

const teams: Team[] = [
  { id: 1, name: 'MushRu', image: '/images/mushru.jpg' },
  { id: 2, name: 'Rycycle', image: '/images/rycycle.jpg' },
  { id: 3, name: 'PetClicks', image: '/images/onezero.jpg' },
  { id: 4, name: 'Brainiacs', image: '/images/brainiacs.jpg' },
  { id: 5, name: 'TropiSip', image: '/images/tropisip.jpg' },
];

const VotingPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleVote = async (teamName: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await api.submitVote(teamName);
      setPopupMessage(`Thank you for voting ${teamName}!`);
      setTimeout(() => setPopupMessage(null), 3000); // Hide popup after 3 seconds
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
      console.error('Voting error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="voting-container">
      <div className="header">
        <h1>TECHNO 2024</h1>
        <h2>Vote for the most popular team</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="vote-container">
        {teams.map((team) => (
          <div key={team.id} className="team" data-number={String(team.id).padStart(2, '0')}>
            <img src={team.image} alt={`Team ${team.name}`} />
            <button 
              className="vote-button" 
              onClick={() => handleVote(team.name)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Voting...' : team.name}
            </button>
          </div>
        ))}
      </div>

      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      <div className="footer">
        <img src="/images/IESL.png" alt="IESL Logo" />
      </div>
    </div>
  );
};

export default VotingPage;