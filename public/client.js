const socket = io();
const messagesContainer = document.getElementById("messages");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatControls = document.getElementById("chatControls");
const nameModal = document.getElementById("nameModal");
const chatContainer = document.querySelector(".chat-container");

let username = "";

// Function to load chat history from localStorage
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(data => appendMessage(data.name, data.message));
}

// Function to save chat messages to localStorage
function saveMessage(name, message) {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ name, message });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Function to append a message to the chat UI
function appendMessage(name, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Add the appropriate class based on who sent the message
    if (name === username) {
        messageElement.classList.add("sender");
    } else {
        messageElement.classList.add("receiver");
    }

    messageElement.innerHTML = `<strong>${name}: </strong>${message}`;
    messagesContainer.appendChild(messageElement);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Check if username exists in localStorage
window.onload = () => {
    const storedName = localStorage.getItem("chatUsername");
    if (storedName) {
        username = storedName;
        showChatInterface();
        loadChatHistory(); // Load chat history
    } else {
        nameModal.style.display = 'flex';
    }
};

// Show chat interface and hide modal
function showChatInterface() {
    nameModal.style.display = 'none';
    chatContainer.style.display = 'flex';
    chatControls.style.display = "flex";
}

// Save username to localStorage and show chat interface
joinBtn.addEventListener("click", () => {
    username = nameInput.value.trim();
    if (username) {
        localStorage.setItem("chatUsername", username); // Save to localStorage
        socket.emit("join", username); // Emit 'join' event to the server
        showChatInterface();
    }
});

// Send message when the send button is clicked
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chatMessage", { name: username, message }); // Send message to server
        saveMessage(username, message); // Save message locally
        appendMessage(username, message); // Append to UI
        messageInput.value = ""; // Clear input
    }
});

// Listen for incoming messages from the server (including system messages)
socket.on("chatMessage", (data) => {
    saveMessage(data.name, data.message); // Save received message locally
    appendMessage(data.name, data.message); // Append to UI
});
