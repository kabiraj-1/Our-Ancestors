document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/friends/requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.ok) {
        const requests = await response.json();
        const requestsDiv = document.getElementById('friendRequests');
        requests.forEach(request => {
            requestsDiv.innerHTML += `
                <div>
                    <p>${request.sender.username}</p>
                    <button onclick="acceptRequest('${request._id}')">Accept</button>
                </div>
            `;
        });
    }
});