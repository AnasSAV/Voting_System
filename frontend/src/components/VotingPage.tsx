import React from 'react';
import '../styles/VotingPage.css';

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
  const handleVote = (teamName: string) => {
    // TODO: Implement voting logic when backend is connected
    console.log(`Voted for ${teamName}`);
  };

  return (
    <div className="voting-container">
      <div className="header">
        <h1>TECHNO 2024</h1>
        <h2>Vote for the most popular team</h2>
      </div>

      <div className="vote-container">
        {teams.map((team) => (
          <div key={team.id} className="team" data-number={String(team.id).padStart(2, '0')}>
            <img src={team.image} alt={`Team ${team.name}`} />
            <button 
              className="vote-button" 
              onClick={() => handleVote(team.name)}
            >
              {team.name}
            </button>
          </div>
        ))}
      </div>

      <div className="footer">
        <img src="/images/IESL.png" alt="IESL Logo" />
      </div>
    </div>
  );
};

export default VotingPage; 