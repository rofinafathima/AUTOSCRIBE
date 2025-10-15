// Global variables
let currentUser = null;
let speechSynthesis = window.speechSynthesis;
let recognition = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    setupEventListeners();
    announcePageLoad();
});

// Initialize speech recognition for accessibility
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Teacher form submission
    document.getElementById('teacher-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleTeacherLogin();
    });

    // Student form submission
    document.getElementById('student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleStudentLogin();
    });


    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideLogin();
        }
    });
}

// Show login form based on user type
function showLogin(userType) {
    // Hide all login forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Hide login options
    document.querySelector('.login-options').style.display = 'none';
    
    // Show selected login form
    document.getElementById(`${userType}-login`).classList.remove('hidden');
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector(`#${userType}-login input`);
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    // Announce to screen readers
    speak(`Please enter your ${userType} credentials`);
}

// Hide login form and show options
function hideLogin() {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    document.querySelector('.login-options').style.display = 'grid';
    
    // Announce to screen readers
    speak('Returned to login options');
}

// Handle teacher login
function handleTeacherLogin() {
    const email = document.getElementById('teacher-email').value;
    const password = document.getElementById('teacher-password').value;
    
    console.log('Attempting teacher login:', { email, password });
    
    // Check if function exists
    if (typeof getTeacherByEmail !== 'function') {
        console.error('getTeacherByEmail function not found');
        alert('System error: Demo data not loaded. Please refresh the page.');
        return;
    }
    
    // Check against demo data
    const teacher = getTeacherByEmail(email);
    console.log('Found teacher:', teacher);
    
    if (teacher && teacher.password === password) {
        currentUser = { 
            type: 'teacher', 
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            department: teacher.department
        };
        storeUserData(currentUser);
        speak('Login successful. Redirecting to teacher dashboard.');
        setTimeout(() => {
            window.location.href = 'teacher-dashboard.html';
        }, 2000);
    } else {
        console.log('Login failed - teacher not found or wrong password');
        speak('Invalid email or password. Please try again.');
        alert('Invalid email or password. Please try again.\n\nDemo credentials:\nEmail: teacher1@autoscribe.edu\nPassword: teacher123');
    }
}

// Handle student login
function handleStudentLogin() {
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('student-password').value;
    const language = document.getElementById('language-select').value;
    
    console.log('Attempting student login:', { studentId, password, language });
    
    // Check if function exists
    if (typeof getStudentById !== 'function') {
        console.error('getStudentById function not found');
        alert('System error: Demo data not loaded. Please refresh the page.');
        return;
    }
    
    // Check against demo data
    const student = getStudentById(studentId);
    console.log('Found student:', student);
    
    if (student && student.password === password) {
        currentUser = { 
            type: 'student', 
            id: student.id,
            name: student.name,
            email: student.email,
            class: student.class,
            language: language 
        };
        storeUserData(currentUser);
        speak('Login successful. Redirecting to student dashboard.');
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 2000);
    } else {
        console.log('Login failed - student not found or wrong password');
        speak('Invalid student ID or password. Please try again.');
        alert('Invalid student ID or password. Please try again.\n\nDemo credentials:\nStudent ID: STU001\nPassword: student123');
    }
}


// Text-to-speech function
function speak(text, rate = 0.8, pitch = 1) {
    if (speechSynthesis) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 1;
        
        // Set voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Announce page load for accessibility
function announcePageLoad() {
    setTimeout(() => {
        speak('Welcome to Autoscribe. Please select your login option: Teacher or Student.');
    }, 1000);
}

// Voice command recognition
function startVoiceCommand() {
    if (!recognition) {
        speak('Voice recognition is not supported in your browser');
        return;
    }
    
    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        processVoiceCommand(command);
    };
    
    recognition.onerror = function(event) {
        speak('Sorry, I could not understand that. Please try again.');
    };
    
    recognition.start();
    speak('Listening for voice command...');
}

// Process voice commands
function processVoiceCommand(command) {
    if (command.includes('teacher') || command.includes('teacher login')) {
        showLogin('teacher');
    } else if (command.includes('student') || command.includes('student login')) {
        showLogin('student');
    } else if (command.includes('back') || command.includes('return')) {
        hideLogin();
    } else if (command.includes('help')) {
        speak('You can say: Teacher login, Student login, Back, or Help');
    } else {
        speak('Command not recognized. Say help for available commands.');
    }
}

// Microphone test function
function testMicrophone() {
    if (!recognition) {
        speak('Voice recognition is not supported in your browser');
        return false;
    }
    
    speak('Please say "Hello" to test your microphone');
    
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript.toLowerCase().trim();
        if (result.includes('hello') || result.includes('hi')) {
            speak('Microphone test successful! Your voice is clear.');
            return true;
        } else {
            speak('Please try saying "Hello" again');
            return false;
        }
    };
    
    recognition.start();
}

// Accessibility helper functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// High contrast mode toggle
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    speak(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
}

// Font size adjustment
function adjustFontSize(direction) {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    const newSize = direction === 'increase' ? currentSize + 2 : currentSize - 2;
    
    if (newSize >= 12 && newSize <= 24) {
        document.body.style.fontSize = newSize + 'px';
        speak(`Font size ${direction === 'increase' ? 'increased' : 'decreased'}`);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + T for teacher login
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        showLogin('teacher');
    }
    
    // Alt + S for student login
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        showLogin('student');
    }
    
    // Alt + V for voice commands
    if (e.altKey && e.key === 'v') {
        e.preventDefault();
        startVoiceCommand();
    }
    
    // Alt + H for help
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        speak('Keyboard shortcuts: Alt+T for teacher login, Alt+S for student login, Alt+V for voice commands, Alt+H for help');
    }
    
    // Alt + + for increase font size
    if (e.altKey && e.key === '+') {
        e.preventDefault();
        adjustFontSize('increase');
    }
    
    // Alt + - for decrease font size
    if (e.altKey && e.key === '-') {
        e.preventDefault();
        adjustFontSize('decrease');
    }
});

// Store user data in localStorage for session management
function storeUserData(userData) {
    localStorage.setItem('autoscribe_user', JSON.stringify(userData));
}

function getUserData() {
    const userData = localStorage.getItem('autoscribe_user');
    return userData ? JSON.parse(userData) : null;
}

function clearUserData() {
    localStorage.removeItem('autoscribe_user');
}

// Export functions for use in other pages
window.AutoscribeUtils = {
    speak,
    startVoiceCommand,
    testMicrophone,
    storeUserData,
    getUserData,
    clearUserData,
    toggleHighContrast,
    adjustFontSize
};
