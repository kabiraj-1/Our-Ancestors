// AI Chat functionality
class Chat {
    static async sendMessage(message) {
        try {
            const response = await fetch('/api/chat.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (data.success) {
                return data.response;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    static displayMessage(message, isUser = false) {
        const chatMessages = document.getElementById('aiChatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Global function for sending AI messages
async function sendAIMessage(predefinedMessage = null) {
    const input = document.getElementById('aiChatInput');
    const message = predefinedMessage || input.value.trim();

    if (!message) return;

    // Display user message
    Chat.displayMessage(message, true);

    // Clear input
    if (!predefinedMessage) {
        input.value = '';
    }

    try {
        const response = await Chat.sendMessage(message);
        Chat.displayMessage(response, false);
    } catch (error) {
        Chat.displayMessage('Sorry, I encountered an error. Please try again.', false);
    }
}
