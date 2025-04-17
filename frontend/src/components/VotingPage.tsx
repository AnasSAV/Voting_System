import React from 'react';
import '../styles/VotingPage.css';

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
        <div className="team">
          <img src="/images/mushru.jpg" alt="Team SSJC" />
          <button className="vote-button" onClick={() => handleVote('MushRu')}>MushRu</button>
        </div>

        <div className="team">
          <img src="/images/rycycle.jpg" alt="Rycycle" />
          <button className="vote-button" onClick={() => handleVote('Rycycle')}>Rycycle</button>
        </div>

        <div className="team">
          <img src="/images/onezero.jpg" alt="Institute of Brainiacs" />
          <button className="vote-button" onClick={() => handleVote('PetClicks')}>PetClicks</button>
        </div>

        <div className="team">
          <img src="/images/brainiacs.jpg" alt="OneZero" />
          <button className="vote-button" onClick={() => handleVote('Brainiacs')}>Brainiacs</button>
        </div>

        <div className="team">
          <img src="/images/tropisip.jpg" alt="TropiSip" />
          <button className="vote-button" onClick={() => handleVote('TropiSip')}>TropiSip</button>
        </div>
      </div>

      <div className="footer">
        <img src="/images/IESL.png" alt="IESL Logo" />
      </div>
    </div>
  );
};

export default VotingPage; 