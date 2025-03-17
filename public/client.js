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

function loadChatHistory() {
    try {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.forEach(data => appendMessage(data.name, data.message));
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

function saveMessage(name, message) {
    try {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.push({ name, message });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (error) {
        console.error("Error saving message:", error);
    }
}

function appendMessage(name, message) {
    try {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", name === username ? "sender" : "receiver");
        messageElement.innerHTML = `<strong>${name}: </strong>${message}`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error("Error appending message:", error);
    }
}

function showChatInterface() {
    try {
        nameModal.style.display = "none";
        chatContainer.style.display = "flex";
        chatControls.style.display = "flex";
    } catch (error) {
        console.error("Error displaying chat interface:", error);
    }
}

function clearHist() {
    try {
        localStorage.clear();
        console.log("Chat cleared");
        location.reload();
    } catch (error) {
        console.error("Error clearing chat history:", error);
    }
}

window.onload = () => {
    try {
        const storedName = localStorage.getItem("chatUsername");
        if (storedName) {
            username = storedName;
            showChatInterface();
            loadChatHistory();
        } else {
            nameModal.style.display = "flex";
        }
    } catch (error) {
        console.error("Error initializing app:", error);
    }
};

joinBtn.addEventListener("click", () => {
    try {
        username = nameInput.value.trim();
        if (username) {
            localStorage.setItem("chatUsername", username);
            socket.emit("join", username);
            showChatInterface();
        }
    } catch (error) {
        console.error("Error joining chat:", error);
    }
});

sendBtn.addEventListener("click", () => {
    try {
        const message = messageInput.value.trim();
        if (message) {
            const data = { name: username, message };
            saveMessage(username, message);
            appendMessage(username, message);
            socket.emit("chatMessage", data);
            messageInput.value = "";
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

socket.on("chatMessage", (data) => {
    try {
        if (data.name !== username) {
            saveMessage(data.name, data.message);
            appendMessage(data.name, data.message);
        }
    } catch (error) {
        console.error("Error receiving message:", error);
    }
});
