const socket = io();

// DOM Elements
const nameModal = document.getElementById('nameModal');
const chatContainer = document.querySelector('.chat-container');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const chatControls = document.getElementById("chatControls");
const themeToggle = document.getElementById('themeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const userNameElement = document.getElementById('userName');
const userInitialElement = document.getElementById('userInitial');
const usersList = document.getElementById('usersList');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const themeOptions = document.querySelectorAll('.theme-option');

let username = '';
const dummyUsers = ['Alex', 'Taylor', 'Jordan', 'Casey'];

// Initialize on load
window.onload = () => {
    const storedName = localStorage.getItem("chatUsername");
    if (storedName) {
        username = storedName;
        handleJoin(true);
        loadChatHistory();
    } else {
        nameModal.style.display = "flex";
    }
};

// Load chat history
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(data => appendMessage(data.name, data.message));
}

// Save message
function saveMessage(name, message) {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ name, message });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Append message
function appendMessage(name, message) {
    const type = name === username ? 'sender' : 'receiver';
    addMessage(message, type, name);
    saveMessage(name, message);
}

// Join handler
function handleJoin(auto = false) {
    if (!auto) username = nameInput.value.trim();
    if (username) {
        localStorage.setItem("chatUsername", username);
        nameModal.style.display = 'none';
        chatContainer.style.display = 'flex';
        chatControls.style.display = 'flex';

        userNameElement.textContent = username;
        userInitialElement.textContent = username.charAt(0).toUpperCase();
        socket.emit("join", username);
        addSystemMessage(`Welcome to Nikka Chat, ${username}!`);
    }
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const data = { name: username, message };
        appendMessage(username, message);
        socket.emit("chatMessage", data);
        messageInput.value = '';
    }
}

// Add message to UI
function addMessage(text, type, user = '') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;

    const messageInfo = document.createElement('div');
    messageInfo.className = 'message-info';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageInfo.textContent = type === 'sender' ? `You • ${timeStr}` :
                              type === 'receiver' ? `${user} • ${timeStr}` : timeStr;

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageInfo);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// System message
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Clear chat history
function clearHist() {
    try {
        localStorage.clear();
        console.log("Chat cleared");
        location.reload();
    } catch (error) {
        console.error("Error clearing chat history:", error);
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') ?
        '<i class="fas fa-sun"></i><span>Light Mode</span>' :
        '<i class="fas fa-moon"></i><span>Dark Mode</span>';
}

// Dummy users
function populateDummyUsers() {
    usersList.innerHTML = "";
    dummyUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
}

// Simulated response (optional)
function simulateResponse() {
    const user = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const replies = ["Hey!", "That's cool!", "Haha nice!", "Interesting...", "Tell me more!"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(reply, 'receiver', user);
}

// Event Listeners
joinBtn.addEventListener('click', () => handleJoin());
nameInput.addEventListener('keypress', e => e.key === 'Enter' && handleJoin());
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
themeToggle.addEventListener('click', toggleTheme);
settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

fontSizeSlider.addEventListener('input', () => {
    const size = fontSizeSlider.value;
    fontSizeValue.textContent = `${size}px`;
    document.documentElement.style.setProperty('--message-font-size', `${size}px`);
});

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        if (option.classList.contains('dark-option')) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        }
    });
});

// Listen for incoming messages from others
socket.on("chatMessage", (data) => {
    if (data.name !== username) {
        appendMessage(data.name, data.message);
    }
});

populateDummyUsers();
