<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nikka Chat Advanced</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>

<body class="light-mode">
    <!-- Mode Toggle -->
    <div class="theme-toggle">
        <button id="themeToggle">
            <i class="fas fa-moon"></i>
            <span>Dark Mode</span>
        </button>
    </div>

    <!-- Modal for entering name -->
    <div id="nameModal" class="modal">
        <div class="modal-content glass-effect">
            <div class="modal-header">
                <h2><i class="fas fa-comments"></i> Welcome to Nikka Chat</h2>
                <p>Join the conversation with a unique username</p>
            </div>
            <div class="input-group">
                <div class="input-icon">
                    <i class="fas fa-user"></i>
                </div>
                <input id="nameInput" type="text" placeholder="Enter your name" />
            </div>
            <button id="joinBtn" class="btn primary-btn">
                <i class="fas fa-sign-in-alt"></i> Join Chat
            </button>
        </div>
    </div>

    <!-- Chat Container -->
    <div class="chat-container glass-effect">
        <div class="chat-header">
            <div class="chat-info">
                <h2><i class="fas fa-comments"></i> Nikka Chat</h2>
                <span id="onlineStatus"><i class="fas fa-circle"></i> Online</span>
            </div>
            <div class="header-actions">
                <button id="settingsBtn" class="icon-btn"><i class="fas fa-cog"></i></button>
                <button id="notificationBtn" class="icon-btn"><i class="fas fa-bell"></i></button>
            </div>
        </div>

        <div class="chat-body">
            <div class="sidebar">
                <div class="user-profile">
                    <div class="avatar">
                        <span id="userInitial"></span>
                    </div>
                    <div class="user-info">
                        <h3 id="userName">User</h3>
                        <span class="status-indicator">Active now</span>
                    </div>
                </div>
                <div class="sidebar-section">
                    <h4>Active Users</h4>
                    <ul id="usersList" class="users-list">
                        <!-- Users will be added dynamically -->
                    </ul>
                </div>
            </div>

            <div class="messages-container">
                <div id="messages" class="messages"></div>
            </div>
        </div>

        <div id="chatControls" class="chat-controls">
            <button class="icon-btn feature-btn"><i class="fas fa-paperclip"></i></button>
            <button class="icon-btn feature-btn"><i class="fas fa-image"></i></button>
            <div class="message-input-wrapper">
                <input id="messageInput" type="text" placeholder="Type a message..." />
                <div class="input-actions">
                    <button class="icon-btn emoji-btn"><i class="fas fa-smile"></i></button>
                </div>
            </div>
            <button id="sendBtn" class="btn primary-btn rounded-btn">
                <i class="fas fa-paper-plane"></i>
            </button>
            <button id="clearBtn" class="icon-btn danger-btn" onclick="clearHist()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="settingsModal" class="modal hidden">
        <div class="modal-content settings-modal glass-effect">
            <div class="modal-header">
                <h2><i class="fas fa-cog"></i> Settings</h2>
                <button id="closeSettingsBtn" class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="settings-section">
                <h3>Appearance</h3>
                <div class="setting-item">
                    <span>Theme</span>
                    <div class="theme-selector">
                        <button class="theme-option light-option active">Light</button>
                        <button class="theme-option dark-option">Dark</button>
                    </div>
                </div>
                <div class="setting-item">
                    <span>Font Size</span>
                    <div class="range-slider">
                        <input type="range" min="12" max="20" value="16" id="fontSizeSlider">
                        <span id="fontSizeValue">16px</span>
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <h3>Notifications</h3>
                <div class="setting-item">
                    <span>Sound Alerts</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>Desktop Notifications</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="client.js"></script>
</body>

</html>
