// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabBtns = document.querySelectorAll('.tab-btn');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const dateTimeDisplay = document.getElementById('date-time');
const mediaPlayerModal = document.getElementById('media-player-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const mediaPlayBtn = document.getElementById('media-play');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const moodOptions = document.querySelectorAll('.mood-option');
const categoryBtns = document.querySelectorAll('.category-btn');
const meditationCards = document.querySelectorAll('.meditation-card');
const playBtns = document.querySelectorAll('.play-btn');
const recommendationCards = document.querySelectorAll('.recommendation-card');
const newEntryBtn = document.querySelector('.new-entry-btn');
const journalEntries = document.querySelectorAll('.journal-entry');
const saveEntryBtn = document.querySelector('.save-btn');
const musicPlayBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackPlayBtns = document.querySelectorAll('.track-play-btn');
const suggestedResponses = document.querySelectorAll('.suggestion');
const sendBtn = document.querySelector('.send-btn');
const chatInput = document.querySelector('.input-container textarea');

// App State
const state = {
    currentUser: null,
    currentPage: 'home',
    selectedMood: null,
    currentMediaPlayer: {
        isPlaying: false,
        currentTime: 0,
        duration: 300, // 5 minutes in seconds
        title: '',
        type: '' // 'meditation' or 'music'
    },
    musicPlayer: {
        isPlaying: false,
        currentTrack: null,
        playlist: [],
        currentIndex: 0
    },
    journalEntries: [
        {
            id: 1,
            title: "Today's Reflections",
            date: "April 13, 2025",
            content: "Started my day with a 10-minute meditation session and it really helped me focus throughout the morning. I noticed I was less reactive to stressful emails and more present during meetings.\n\nThings I'm grateful for today:\n- The sunny weather that brightened my mood\n- A productive conversation with my team\n- Making time for self-care\n\nTomorrow I want to try the new sleep meditation to help with my insomnia.",
            mood: "Calm"
        },
        {
            id: 2,
            title: "Progress Report",
            date: "April 10, 2025",
            content: "I've been consistent with my mindfulness practice for a week now and I'm noticing some positive changes. My sleep has improved and I'm finding it easier to focus at work. I still struggle with anxiety in the evenings though.",
            mood: "Good"
        },
        {
            id: 3,
            title: "Gratitude List",
            date: "April 5, 2025",
            content: "1. My supportive family\n2. The beautiful weather today\n3. Having time to practice self-care\n4. The delicious meal I had for dinner\n5. Making progress in my meditation practice",
            mood: "Great"
        }
    ],
    chatMessages: [
        {
            sender: 'bot',
            message: "Hi there! I'm your MindCare Assistant. How can I help you today? You can ask me about stress management, sleep tips, meditation techniques, or just chat about how you're feeling.",
            time: "10:00 AM"
        },
        {
            sender: 'user',
            message: "I've been feeling anxious lately. Any tips to help calm my mind?",
            time: "10:05 AM"
        },
        {
            sender: 'bot',
            message: "I'm sorry to hear you're feeling anxious. Here are some techniques that might help:\n\n• Try deep breathing: Inhale slowly for 4 counts, hold for 2, exhale for 6\n• Practice the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste\n• Consider our \"Anxiety Relief\" meditation in the Meditation section\n\nWould you like to try any of these now?",
            time: "10:06 AM"
        }
    ]
};

// Initialize App
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Check if user is logged in
    checkAuthStatus();
}

// Event Listeners
function setupEventListeners() {
    // Auth tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchAuthTab(tab);
        });
    });
    
    // Login and Register
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            navigateTo(page);
        });
    });
    
    // Mood Tracker
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mood = option.getAttribute('data-mood');
            selectMood(mood);
        });
    });
    
    // Category Filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterByCategory(btn, category);
        });
    });
    
    // Meditation Cards
    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.meditation-card');
            openMediaPlayer('meditation', card);
        });
    });
    
    // Recommendation Cards
    recommendationCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            navigateTo(target);
        });
    });
    
    // Media Player Modal
    closeModalBtn.addEventListener('click', closeMediaPlayer);
    mediaPlayBtn.addEventListener('click', toggleMediaPlayback);
    
    // Journal
    newEntryBtn.addEventListener('click', createNewJournalEntry);
    journalEntries.forEach(entry => {
        entry.addEventListener('click', () => {
            selectJournalEntry(entry);
        });
    });
    saveEntryBtn.addEventListener('click', saveJournalEntry);
    
    // Music Player
    musicPlayBtn.addEventListener('click', toggleMusicPlayback);
    prevBtn.addEventListener('click', playPreviousTrack);
    nextBtn.addEventListener('click', playNextTrack);
    trackPlayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const trackItem = e.target.closest('.track-item');
            playTrack(trackItem);
        });
    });
    
    // Chatbot
    suggestedResponses.forEach(btn => {
        btn.addEventListener('click', () => {
            sendChatMessage(btn.textContent);
        });
    });
    sendBtn.addEventListener('click', () => {
        sendChatMessage(chatInput.value);
    });
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage(chatInput.value);
        }
    });
}

// Authentication Functions
function checkAuthStatus() {
    // Check local storage for logged in user
    const user = localStorage.getItem('mindCareUser');
    if (user) {
        state.currentUser = JSON.parse(user);
        showApp();
        updateUserInfo();
    } else {
        showAuth();
    }
}

function switchAuthTab(tab) {
    // Remove active class from all tabs and forms
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');
    
    // Add active class to selected tab and form
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Mock login - in a real app this would make an API call
    // For demo purposes, we'll just accept any valid-looking input
    if (email.includes('@') && password.length >= 6) {
        const user = {
            name: email.split('@')[0], // Use part of email as name
            email: email,
            avatar: '/api/placeholder/40/40'
        };
        
        // Save user to local storage and state
        localStorage.setItem('mindCareUser', JSON.stringify(user));
        state.currentUser = user;
        
        // Show app
        showApp();
        updateUserInfo();
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    
    // Mock registration - in a real app this would make an API call
    const user = {
        name: name,
        email: email,
        avatar: '/api/placeholder/40/40'
    };
    
    // Save user to local storage and state
    localStorage.setItem('mindCareUser', JSON.stringify(user));
    state.currentUser = user;
    
    // Show app
    showApp();
    updateUserInfo();
}

function handleLogout() {
    // Clear user from local storage and state
    localStorage.removeItem('mindCareUser');
    state.currentUser = null;
    
    // Show auth screen
    showAuth();
}

function showAuth() {
    authContainer.classList.add('active');
    appContainer.style.display = 'none';
}

function showApp() {
    authContainer.classList.remove('active');
    appContainer.style.display = 'block';
}

function updateUserInfo() {
    if (state.currentUser) {
        document.querySelector('.user-name').textContent = state.currentUser.name;
    }
}

// Navigation Functions
function navigateTo(page) {
    // Update state
    state.currentPage = page;
    
    // Remove active class from all nav items and pages
    navItems.forEach(item => item.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    
    // Add active class to selected nav item and page
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
    document.getElementById(page).classList.add('active');
}

// Date and Time Functions
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    dateTimeDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Mood Tracker Functions
function selectMood(mood) {
    // Update state
    state.selectedMood = mood;
    
    // Remove active class from all mood options
    moodOptions.forEach(option => option.classList.remove('active'));
    
    // Add active class to selected mood
    document.querySelector(`.mood-option[data-mood="${mood}"]`).classList.add('active');
    
    // Show confirmation (could be enhanced with animations)
    alert(`Mood logged: ${mood}`);
}

// Category Filter Functions
function filterByCategory(clickedBtn, category) {
    // Get the parent container to determine which filter group was clicked
    const parentContainer = clickedBtn.closest('.category-filter');
    const itemsToFilter = parentContainer.nextElementSibling.children;
    
    // Remove active class from all category buttons in this group
    parentContainer.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    clickedBtn.classList.add('active');
    
    // Filter items
    Array.from(itemsToFilter).forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            const categories = item.getAttribute('data-categories') || 
                              item.getAttribute('data-category') || '';
            
            if (categories.includes(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Media Player Functions
function openMediaPlayer(type, contentElement) {
    // Get media information
    let title, duration, image, description;
    
    if (type === 'meditation') {
        title = contentElement.querySelector('h3').textContent;
        duration = contentElement.querySelector('.duration').textContent;
        image = contentElement.querySelector('img').src;
        description = contentElement.querySelector('p').textContent;
    } else if (type === 'music') {
        title = contentElement.querySelector('h4').textContent;
        duration = contentElement.querySelector('.track-duration').textContent;
        image = contentElement.querySelector('img').src;
        description = contentElement.querySelector('p').textContent;
    }
    
    // Update modal content
    document.getElementById('media-title').textContent = title;
    document.getElementById('media-img').src = image;
    document.getElementById('media-desc').textContent = description;
    document.getElementById('total-time').textContent = duration;
    
    // Reset player state
    state.currentMediaPlayer = {
        isPlaying: false,
        currentTime: 0,
        duration: convertTimeToSeconds(duration),
        title: title,
        type: type
    };
    
    // Update UI
    mediaPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.querySelector('.media-progress-fill').style.width = '0%';
    document.getElementById('current-time').textContent = '0:00';
    document.querySelector('.timer-display').textContent = duration;
    
    // Show modal
    mediaPlayerModal.style.display = 'flex';
    
    // Add fadeIn animation
    mediaPlayerModal.classList.add('fadeIn');
}

function closeMediaPlayer() {
    // Hide modal
    mediaPlayerModal.style.display = 'none';
    
    // Stop any playing media
    stopMediaPlayback();
}

function toggleMediaPlayback() {
    if (state.currentMediaPlayer.isPlaying) {
        pauseMediaPlayback();
    } else {
        startMediaPlayback();
    }
}

function startMediaPlayback() {
    // Update state
    state.currentMediaPlayer.isPlaying = true;
    
    // Update UI
    mediaPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Start timer
    startMediaTimer();
}

function pauseMediaPlayback() {
    // Update state
    state.currentMediaPlayer.isPlaying = false;
    
    // Update UI
    mediaPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Stop timer
    stopMediaTimer();
}

function stopMediaPlayback() {
    // Update state
    state.currentMediaPlayer.isPlaying = false;
    state.currentMediaPlayer.currentTime = 0;
    
    // Update UI
    mediaPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.querySelector('.media-progress-fill').style.width = '0%';
    document.getElementById('current-time').textContent = '0:00';
    
    // Stop timer
    stopMediaTimer();
}

let mediaTimerInterval = null;

function startMediaTimer() {
    stopMediaTimer(); // Clear any existing timer
    
    mediaTimerInterval = setInterval(() => {
        // Increment current time
        state.currentMediaPlayer.currentTime++;
        
        // Check if media is complete
        if (state.currentMediaPlayer.currentTime >= state.currentMediaPlayer.duration) {
            stopMediaPlayback();
            return;
        }
        
        // Update progress bar
        const progress = (state.currentMediaPlayer.currentTime / state.currentMediaPlayer.duration) * 100;
        document.querySelector('.media-progress-fill').style.width = `${progress}%`;
        
        // Update time displays
        document.getElementById('current-time').textContent = formatTime(state.currentMediaPlayer.currentTime);
        
        // Update timer display (countdown for meditation)
        if (state.currentMediaPlayer.type === 'meditation') {
            const remainingTime = state.currentMediaPlayer.duration - state.currentMediaPlayer.currentTime;
            document.querySelector('.timer-display').textContent = formatTime(remainingTime);
        }
    }, 1000);
}

function stopMediaTimer() {
    clearInterval(mediaTimerInterval);
}

// Journal Functions
function createNewJournalEntry() {
    // Create a new entry object
    const now = new Date();
    const newEntry = {
        id: Date.now(), // Use timestamp as ID
        title: "New Entry",
        date: now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        }),
        content: "",
        mood: ""
    };
    
    // Add to state
    state.journalEntries.unshift(newEntry);
    
    // Update UI
    renderJournalEntries();
    
    // Select the new entry
    selectJournalEntry(document.querySelector('.journal-entry'));
}

function renderJournalEntries() {
    const entriesContainer = document.querySelector('.journal-entries');
    
    // Clear existing entries
    entriesContainer.innerHTML = '';
    
    // Add entries
    state.journalEntries.forEach(entry => {
        const entryEl = document.createElement('div');
        entryEl.classList.add('journal-entry');
        entryEl.setAttribute('data-id', entry.id);
        
        entryEl.innerHTML = `
            <h3>${entry.title}</h3>
            <p class="entry-date">${entry.date}</p>
            <p class="entry-preview">${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</p>
        `;
        
        entryEl.addEventListener('click', () => {
            selectJournalEntry(entryEl);
        });
        
        entriesContainer.appendChild(entryEl);
    });
}

function selectJournalEntry(entryElement) {
    // Remove active class from all entries
    document.querySelectorAll('.journal-entry').forEach(entry => {
        entry.classList.remove('active');
    });
    
    // Add active class to selected entry
    entryElement.classList.add('active');
    
    // Get entry ID
    const entryId = parseInt(entryElement.getAttribute('data-id') || entryElement.dataset.id);
    
    // Find entry in state
    const entry = state.journalEntries.find(e => e.id === entryId) || state.journalEntries[0];
    
    // Update editor
    document.querySelector('.entry-title').value = entry.title;
    document.querySelector('.journal-content').value = entry.content;
    
    if (entry.mood) {
        document.querySelector('.mood-tag span').textContent = `Feeling: ${entry.mood}`;
    } else {
        document.querySelector('.mood-tag span').textContent = 'No mood set';
    }
}

function saveJournalEntry() {
    // Get active entry
    const activeEntry = document.querySelector('.journal-entry.active');
    if (!activeEntry) return;
    
    // Get entry ID
    const entryId = parseInt(activeEntry.getAttribute('data-id') || activeEntry.dataset.id);
    
    // Get updated values
    const title = document.querySelector('.entry-title').value;
    const content = document.querySelector('.journal-content').value;
    
    // Find and update entry in state
    const entryIndex = state.journalEntries.findIndex(e => e.id === entryId);
    if (entryIndex >= 0) {
        state.journalEntries[entryIndex].title = title;
        state.journalEntries[entryIndex].content = content;
        
        // Update UI
        activeEntry.querySelector('h3').textContent = title;
        activeEntry.querySelector('.entry-preview').textContent = 
            content.substring(0, 100) + (content.length > 100 ? '...' : '');
    }
    
    // Show confirmation
    alert('Journal entry saved!');
}

// Music Player Functions
function toggleMusicPlayback() {
    if (state.musicPlayer.isPlaying) {
        pauseMusicPlayback();
    } else {
        startMusicPlayback();
    }
}

function startMusicPlayback() {
    // Check if a track is selected
    if (!state.musicPlayer.currentTrack) {
        // Select first track as default
        const firstTrack = document.querySelector('.track-item');
        if (firstTrack) {
            playTrack(firstTrack);
        }
        return;
    }
    
    // Update state
    state.musicPlayer.isPlaying = true;
    
    // Update UI
    musicPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Start progress animation
    simulateMusicProgress();
}

function pauseMusicPlayback() {
    // Update state
    state.musicPlayer.isPlaying = false;
    
    // Update UI
    musicPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Stop progress animation
    clearInterval(state.musicPlayer.progressInterval);
}

function playTrack(trackElement) {
    // Get track info
    const title = trackElement.querySelector('h4').textContent;
    const artist = trackElement.querySelector('p').textContent;
    const image = trackElement.querySelector('img').src;
    const duration = trackElement.querySelector('.track-duration').textContent;
    
    // Update state
    state.musicPlayer.currentTrack = {
        title: title,
        artist: artist,
        image: image,
        duration: duration
    };
    
    // Update UI
    document.querySelector('.song-title').textContent = title;
    document.querySelector('.song-artist').textContent = artist;
    document.querySelector('.song-thumbnail').src = image;
    document.querySelector('.music-player .duration').textContent = duration;
    
    // Reset progress
    document.querySelector('.music-player .progress').style.width = '0%';
    document.querySelector('.current-time').textContent = '0:00';
    
    // Start playback
    pauseMusicPlayback(); // First stop any playing music
    startMusicPlayback();
}

function playPreviousTrack() {
    // Find previous track in playlist
    // For now just simulate with a message
    alert('Playing previous track (simulated)');
}

function playNextTrack() {
    // Find next track in playlist
    // For now just simulate with a message
    alert('Playing next track (simulated)');
}

function simulateMusicProgress() {
    let progress = 0;
    const progressBar = document.querySelector('.music-player .progress');
    const currentTimeDisplay = document.querySelector('.current-time');
    const duration = convertTimeToSeconds(state.musicPlayer.currentTrack.duration);
    
    clearInterval(state.musicPlayer.progressInterval);
    
    state.musicPlayer.progressInterval = setInterval(() => {
        progress += 1;
        
        if (progress >= duration) {
            clearInterval(state.musicPlayer.progressInterval);
            pauseMusicPlayback();
            progress = 0;
        }
        
        const progressPercent = (progress / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(progress);
    }, 1000);
}

// Chatbot Functions
function sendChatMessage(message) {
    if (!message.trim()) return;
    
    // Clear input
    chatInput.value = '';
    
    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    
    // Add user message to state
    state.chatMessages.push({
        sender: 'user',
        message: message,
        time: timeString
    });
    
    // Render messages
    renderChatMessages();
    
    // Simulate bot response after a delay
    setTimeout(() => {
        // Add bot response to state
        state.chatMessages.push({
            sender: 'bot',
            message: generateBotResponse(message),
            time: timeString
        });
        
        // Render messages
        renderChatMessages();
    }, 1000);
}

function renderChatMessages() {
    const messagesContainer = document.querySelector('.chat-messages');
    
    // Clear existing messages
    messagesContainer.innerHTML = '';
    
    // Add messages
    state.chatMessages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', msg.sender);
        
        if (msg.sender === 'bot') {
            messageEl.innerHTML = `
                <div class="message-avatar">
                    <img src="/api/placeholder/40/40" alt="Bot Avatar">
                </div>
                <div class="message-content">
                    <p>${formatMessageText(msg.message)}</p>
                    <span class="message-time">${msg.time}</span>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="message-content">
                    <p>${formatMessageText(msg.message)}</p>
                    <span class="message-time">${msg.time}</span>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageEl);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatMessageText(text) {
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Convert bullet points
    text = text.replace(/•/g, '&#8226;');
    
    return text;
}

function generateBotResponse(message) {
    // Simple keyword-based responses
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "Hello! How are you feeling today?";
    } else if (lowerMsg.includes('how are you')) {
        return "I'm here to help you! Tell me how you're feeling or what I can assist you with today.";
    } else if (lowerMsg.includes('anxious') || lowerMsg.includes('anxiety')) {
        return "I understand anxiety can be challenging. Have you tried the 4-7-8 breathing technique? Inhale for 4 seconds, hold for 7, and exhale for 8. This can help activate your parasympathetic nervous system.";
    } else if (lowerMsg.includes('sad') || lowerMsg.includes('depress')) {
        return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to try a quick gratitude exercise or perhaps a mood-lifting meditation?";
    } else if (lowerMsg.includes('sleep') || lowerMsg.includes('insomnia')) {
        return "Sleep troubles can be frustrating. Try creating a calming bedtime routine: reduce screen time an hour before bed, keep your room cool and dark, and consider our sleep meditation sessions.";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('overwhelm')) {
        return "When you're feeling overwhelmed, try breaking things down into smaller, manageable tasks. The 'Focus' meditation sessions can also help center your mind when things feel chaotic.";
    } else if (lowerMsg.includes('meditation') || lowerMsg.includes('meditate')) {
        return "Meditation is a wonderful practice! We have various guided sessions in our Meditation section. For beginners, I recommend starting with 5-minute sessions focusing on breath awareness.";
    } else if (lowerMsg.includes('music') || lowerMsg.includes('sound')) {
        return "Music can have a powerful effect on our mood. Check out our Music section for calming nature sounds, focus beats, and relaxing melodies.";
    } else if (lowerMsg.includes('journal') || lowerMsg.includes('writing')) {
        return "Journaling is a great way to process your thoughts and emotions. Try our Journal section where you can record your experiences, feelings, and growth over time.";
    } else if (lowerMsg.includes('thank')) {
        return "You're very welcome! I'm here to support you on your mental wellness journey.";
    } else {
        return "Thank you for sharing. Remember that taking care of your mental health is a journey. Is there a specific area you'd like support with today?";
    }
}

// Utility Functions
function convertTimeToSeconds(timeString) {
    const parts = timeString.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
        return parseInt(parts[0]) * 60; // Default to minutes if only one part
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);