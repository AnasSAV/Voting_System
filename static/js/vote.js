function submitVote(teamName) {
    // Get the vote button that was clicked
    const voteButton = document.querySelector(`button[data-team='${teamName}']`);
    
    // Disable the button and add a loading spinner or text
    voteButton.disabled = true;
    voteButton.textContent = 'Submitting...';

    // Create a popup message for user feedback
    const popupMessage = document.createElement('div');
    popupMessage.style.position = 'fixed';
    popupMessage.style.top = '50%';
    popupMessage.style.left = '50%';
    popupMessage.style.transform = 'translate(-50%, -50%)';
    popupMessage.style.backgroundColor = '#333';
    popupMessage.style.color = '#fff';
    popupMessage.style.padding = '20px';
    popupMessage.style.borderRadius = '10px';
    popupMessage.style.zIndex = '1000';
    popupMessage.style.textAlign = 'center';
    popupMessage.style.fontSize = '1.2rem';
    document.body.appendChild(popupMessage);

    // Send the vote request
    fetch('/submit_vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team: teamName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Vote submission failed');
        }
        return response.json();
    })
    .then(data => {
        // Show success message and reload page after 2 seconds
        popupMessage.textContent = `Thank you for voting for ${teamName}!`;
        setTimeout(() => {
            document.body.removeChild(popupMessage);
            window.location.reload(); // Reload the page after a successful vote
        }, 2000); // 2 seconds delay
    })
    .catch((error) => {
        console.error('Error:', error);
        // Show error message
        popupMessage.textContent = "There was an error submitting your vote.";
        // Re-enable the button and reset its text
        voteButton.disabled = false;
        voteButton.textContent = `Vote for ${teamName}`;
        setTimeout(() => {
            document.body.removeChild(popupMessage);
        }, 2000); // Remove error message after 2 seconds
    });
}
