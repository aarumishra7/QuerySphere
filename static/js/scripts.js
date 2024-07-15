document.addEventListener('DOMContentLoaded', () => {
    const connectForm = document.getElementById('connect-form');
    const connectBtn = document.getElementById('connect-btn');
    const historyBtn = document.getElementById('history-btn');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    connectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(connectForm);
        const data = Object.fromEntries(formData.entries());
        
        fetch('/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Connected successfully!');
            } else {
                alert('Failed to connect.');
            }
        });
    });
    
    historyBtn.addEventListener('click', () => {
        fetch('/history')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';
                data.chat_history.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = message;
                    chatMessages.appendChild(messageElement);
                });
            });
    });

    sendBtn.addEventListener('click', () => {
        const query = chatInput.value;
        if (query) {
            sendQuery(query);
        }
    });

    micBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                chatInput.value = speechResult;
                sendQuery(speechResult);
            };

            recognition.onspeechend = () => {
                recognition.stop();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    });

    function sendQuery(query) {
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })
        .then(response => response.json())
        .then(data => {
            const responseElement = document.createElement('div');
            responseElement.textContent = data.response;
            chatMessages.appendChild(responseElement);
            chatInput.value = '';
        });
    }
});