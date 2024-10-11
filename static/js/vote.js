function submitVote(teamName) {
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

    fetch('/submit_vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team: teamName }),
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            document.body.removeChild(popupMessage);
            window.location.href = '/'; // Redirect back to the voting page
        }, 2200); // 2.2 seconds delay
    })
    .catch((error) => {
        console.error('Error:', error);
        popupMessage.textContent = "There was an error submitting your vote.";
        setTimeout(() => {
            document.body.removeChild(popupMessage);
        }, 2200); // Remove error message after 2.2 seconds
    });
}
