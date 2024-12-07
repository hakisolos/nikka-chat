const socket = io();
const messagesContainer = document.getElementById("messages");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const nameModal = document.getElementById("nameModal");
const chatContainer = document.querySelector(".chat-container");

let username = "";

// Function to load chat history from localStorage
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(data => {
        appendMessage(data.name, data.message);
    });
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

// Initialize the app
window.onload = () => {
    const storedName = localStorage.getItem("chatUsername");
    if (storedName) {
        username = storedName;
        showChatInterface();
        loadChatHistory();
    } else {
        nameModal.style.display = "flex";  // Ensure modal shows up
    }
};

// Show the chat interface
function showChatInterface() {
    nameModal.style.display = "none";
    chatContainer.style.display = "flex";  // Show the chat container
}

// Handle the 'Join Chat' button click
joinBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
        username = name;
        localStorage.setItem("chatUsername", username);
        showChatInterface();
        loadChatHistory();
    }
});

// Send message event
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", { name: username, message });
        appendMessage(username, message);
        saveMessage(username, message);
        messageInput.value = "";  // Clear input field
    }
});

// Listen for incoming messages
socket.on("chat message", data => {
    appendMessage(data.name, data.message);
});
