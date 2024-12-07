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

// Check if username exists in local storage
window.onload = () => {
    const storedName = localStorage.getItem("chatUsername");
    if (storedName) {
        username = storedName;
        showChatInterface();
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

// Save username to local storage and show chat interface
joinBtn.addEventListener("click", () => {
    username = nameInput.value.trim();
    if (username) {
        localStorage.setItem("chatUsername", username); // Save to local storage
        socket.emit("join", username); // Emit 'join' event to the server
        showChatInterface();
    }
});

// Send message when the send button is clicked
sendBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chatMessage", { name: username, message });
        messageInput.value = ""; // Clear input
    }
});

// Listen for incoming messages from the server (including system messages)
socket.on("chatMessage", (data) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Add the appropriate class based on who sent the message
    if (data.name === username) {
        messageElement.classList.add("sender");
    } else {
        messageElement.classList.add("receiver");
    }

    messageElement.innerHTML = `<strong>${data.name}: </strong>${data.message}`;
    messagesContainer.appendChild(messageElement);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Add a logout button functionality
const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Logout";
logoutBtn.style.margin = "10px";
logoutBtn.onclick = () => {
    localStorage.removeItem("chatUsername");
    location.reload(); // Reload the page
};
chatContainer.appendChild(logoutBtn);
