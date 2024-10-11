function submitVote(teamName, pageNumber) {
    // Get the vote button that was clicked
    const voteButton = document.querySelector(`button[data-team='${teamName}']`);
    
    // Disable the button to prevent multiple clicks
    voteButton.disabled = true;
    voteButton.textContent = 'Submitting...';

    // Show the popup immediately after the user clicks the vote button
    const popupMessage = document.createElement('div');
    popupMessage.textContent = `Thank you for voting for ${teamName}!`;
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
        body: JSON.stringify({ team: teamName, page: pageNumber }),  // Include page number in the payload
    })
    .then(response => response.json())
    .then(data => {
        // After 2.2 seconds, remove the popup and redirect to the same page
        setTimeout(() => {
            document.body.removeChild(popupMessage);
            window.location.href = `/vote/${pageNumber}`;  // Redirect back to the same voting page
        }, 2200); // 2.2 seconds delay
    })
    .catch((error) => {
        console.error('Error:', error);
        popupMessage.textContent = "There was an error submitting your vote.";
        setTimeout(() => {
            document.body.removeChild(popupMessage);
            // Re-enable the button if an error occurred
            voteButton.disabled = false;
            voteButton.textContent = `Vote for ${teamName}`;
        }, 2200); // Remove error message after 2.2 seconds
    });
}
