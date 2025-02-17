const socket = io();
let currentChatUserId;

document.addEventListener('DOMContentLoaded', () => {
    currentChatUserId = new URLSearchParams(window.location.search).get('userId');
    socket.emit('join', currentChatUserId);

    fetch(`/api/chat/${currentChatUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(messages => {
        messages.forEach(appendMessage);
    });

    socket.on('newMessage', appendMessage);
});

function appendMessage(message) {
    const chatDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender === currentChatUserId ? 'received' : 'sent'}`;
    messageDiv.innerHTML = `<p>${message.content}</p><small>${new Date(message.timestamp).toLocaleTimeString()}</small>`;
    chatDiv.appendChild(messageDiv);
}