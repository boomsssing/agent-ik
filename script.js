// Page Navigation
const introPage = document.getElementById('intro-page');
const optionsPage = document.getElementById('options-page');
const chatbotPage = document.getElementById('chatbot-page');
const tapToBegin = document.getElementById('tap-to-begin');
const basicMode = document.getElementById('basic-mode');
const godMode = document.getElementById('god-mode');
const closeChat = document.getElementById('close-chat');

tapToBegin.addEventListener('click', () => {
    introPage.classList.remove('active');
    optionsPage.classList.add('active');
});

basicMode.addEventListener('click', () => startChat('basic'));
godMode.addEventListener('click', () => startChat('god'));
closeChat.addEventListener('click', () => {
    chatbotPage.classList.remove('active');
    optionsPage.classList.add('active');
    clearChat();
});

// Chatbot Logic
const chatOutput = document.getElementById('chat-output');
const chatInput = document.getElementById('chat-input');
const sendMsg = document.getElementById('send-msg');
const newTap = document.getElementById('new-tap');
let mode = 'basic';
let memory = [];

function startChat(selectedMode) {
    mode = selectedMode;
    optionsPage.classList.remove('active');
    chatbotPage.classList.add('active');
    chatOutput.innerHTML = `<p>Hey! I’m Agent-IKnow, built by Kofi Fosu, the Cosmos Coderr. ${mode === 'god' ? 'Godmode activated—let’s explore the universe!' : 'Basic mode on—ready to help!'}</p>`;
}

sendMsg.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    chatOutput.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    memory.push({ user: message });
    respondToMessage(message);
    chatInput.value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function respondToMessage(message) {
    let response = '';
    if (mode === 'basic') {
        response = `Researching "${message}"... Here’s a quick take: [Simulated Basic Answer]. Want more?`;
    } else {
        response = `In Godmode, I, Agent-IKnow, the Super Intelligent God of Research, declare: "${message}" unveils cosmic truths! [Simulated Epic Answer]. Shall we dive deeper, mortal?`;
    }
    chatOutput.innerHTML += `<p><strong>Agent-IKnow:</strong> ${response}</p>`;
    memory.push({ agent: response });
}

newTap.addEventListener('click', () => {
    clearChat();
    chatOutput.innerHTML = `<p>Resetting my cosmic brain! ${mode === 'god' ? 'Godmode still on—ask away!' : 'Basic mode, fresh start!'}</p>`;
});

// Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const memoryToggle = document.getElementById('memory-toggle');

settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('settings-hidden');
});

memoryToggle.addEventListener('change', () => {
    if (!memoryToggle.checked) memory = [];
});

function clearChat() {
    chatOutput.innerHTML = '';
    if (memoryToggle.checked) chatOutput.innerHTML += `<p>Memory intact—${memory.length} items stored.</p>`;
    else memory = [];
}
