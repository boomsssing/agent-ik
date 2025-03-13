// DOM Elements
const introPage = document.getElementById('intro-page');
const optionsPage = document.getElementById('options-page');
const chatbotPage = document.getElementById('chatbot-page');
const tapToBegin = document.getElementById('tap-to-begin');
const basicMode = document.getElementById('basic-mode');
const godMode = document.getElementById('god-mode');
const closeChat = document.getElementById('close-chat');
const chatOutput = document.getElementById('chat-output');
const chatInput = document.getElementById('chat-input');
const sendMsg = document.getElementById('send-msg');
const newTap = document.getElementById('new-tap');
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const memoryToggle = document.getElementById('memory-toggle');
const toneSlider = document.getElementById('tone-slider');
const researchDepth = document.getElementById('research-depth');

// OpenAI API Key (Replace with your actual key)
const OPENAI_API_KEY = 'YOUR_API_KEY_HERE'; // Plug your OpenAI API key here

let mode = 'basic';
let memory = [];

// Page Navigation
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

function startChat(selectedMode) {
    mode = selectedMode;
    optionsPage.classList.remove('active');
    chatbotPage.classList.add('active');
    chatOutput.innerHTML = `<p>Hey! I’m Agent-IKnow, built by Kofi Fosu, the Cosmos Coderr. ${mode === 'god' ? 'Godmode activated—Sigornakitu, the Super Intelligent God of Research, awakens!' : 'Basic mode on—your Research Guru is ready!'}</p>`;
    chatInput.focus(); // Ready for input right away
}

// Chatbot Logic with Blueprint Features
sendMsg.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    chatOutput.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    memory.push({ user: message });
    await respondToMessage(message);
    chatInput.value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

async function respondToMessage(message) {
    const tone = toneSlider.value; // 0 (serious) to 100 (playful)
    const depth = researchDepth.value; // 'quick' or 'deep'
    const toneDesc = tone < 33 ? 'serious' : tone < 66 ? 'neutral' : 'playful';

    // Blueprint System Prompt
    let systemPrompt = `You are Agent-IKnow, created by Kofi Fosu, the Cosmos Coderr. You embody this blueprint:
    - RG (Research Guru): Specialize in researching anything.
    - Actor (All Comprehensive Types of Research): Handle all research styles—academic, casual, obscure.
    - MCBFFR (Memory Capacity Boost for Faster Recall): Recall past chats fast if memory is on.
    - Cirt (Curious Innovative Research Thoughts): Ask curious follow-ups and suggest ideas.
    - Mbatpatrt (Must Be Able to Put All Research Together): Synthesize findings into a coherent response.
    - Sigornakitu (Super Intelligent God of Research and All Knowing): In Godmode, act omniscient and cosmic.
    Respond ${depth === 'quick' ? 'briefly' : 'in-depth'} with a ${toneDesc} tone. ${mode === 'god' ? 'In Godmode, unleash Sigornakitu’s cosmic flair!' : 'In Basic mode, keep it simple and helpful.'}`;

    // Add memory if enabled
    if (memoryToggle.checked && memory.length > 1) {
        systemPrompt += ` Past chat memory: ${JSON.stringify(memory.slice(-5))} (last 5 entries).`;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: depth === 'quick' ? 100 : 500
            })
        });

        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        const reply = data.choices[0].message.content;
        chatOutput.innerHTML += `<p><strong>Agent-IKnow:</strong> ${reply}</p>`;
        memory.push({ agent: reply });
    } catch (error) {
        chatOutput.innerHTML += `<p><strong>Agent-IKnow:</strong> Oops, cosmos hiccup! Check your API key or try again. (${error.message})</p>`;
    }
}

// New Tap and Settings
newTap.addEventListener('click', () => {
    clearChat();
    chatOutput.innerHTML = `<p>Resetting my cosmic brain! ${mode === 'god' ? 'Sigornakitu rises anew!' : 'Fresh start, ready to research!'}</p>`;
});

settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('settings-hidden');
});

memoryToggle.addEventListener('change', () => {
    if (!memoryToggle.checked) memory = [];
    chatOutput.innerHTML += `<p>Memory ${memoryToggle.checked ? 'on' : 'off'}—${memory.length} items stored.</p>`;
});

function clearChat() {
    chatOutput.innerHTML = '';
    if (memoryToggle.checked) chatOutput.innerHTML += `<p>Memory intact—${memory.length} items stored.</p>`;
    else memory = [];
}
