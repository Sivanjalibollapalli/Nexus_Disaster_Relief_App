document.addEventListener('DOMContentLoaded', () => { 		
    document.getElementById('send-btn').addEventListener('click', function () {
        sendMessage();
    });

    document.getElementById('message-input').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        var messageInput = document.getElementById('message-input');
        var messageText = messageInput.value;
        if (messageText.trim() !== "") {
            var messageElement = document.createElement('div');
            messageElement.className = 'chat-message chat-message-sent';
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${messageText}</div>
                    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
                </div>
                <img src="student.gif" alt="Profile" class="avatar">
            `;
            document.getElementById('chat-history').appendChild(messageElement);
            messageInput.value = '';
        }
    }
});
