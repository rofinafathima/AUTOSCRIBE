// Enhanced Mock Exam with Voice Input and Text-to-Speech for Blind Students
console.log('Loading enhanced-mock-exam.js...');

(function() {
    'use strict';
    
// Mock Exam Questions
const mockExamQuestions = [
    {
        id: 1,
        text: 'What is the capital of France?',
        type: 'mcq',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        marks: 2
    },
    {
        id: 2,
        text: 'Who wrote the play Romeo and Juliet?',
        type: 'mcq',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 1,
        marks: 2
    },
    {
        id: 3,
        text: 'What is 7 multiplied by 8?',
        type: 'mcq',
        options: ['54', '56', '64', '72'],
        correctAnswer: 1,
        marks: 2
    },
    {
        id: 4,
        text: 'Name the largest planet in our solar system.',
        type: 'text',
        correctAnswer: 'Jupiter',
        marks: 2
    },
    {
        id: 5,
        text: 'What is the boiling point of water in Celsius?',
        type: 'text',
        correctAnswer: '100',
        marks: 2
    }
];

// Mock Exam State
let currentMockExam = {
    questions: mockExamQuestions,
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
    timeLimit: 600, // 10 minutes in seconds
    timerInterval: null,
    isActive: false
};

// Speech Recognition Setup
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;

// Initialize Speech Recognition
function initSpeechRecognition() {
    // Use multilingual voice system if available
    if (window.initMultilingualVoice) {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        return window.initMultilingualVoice(currentLang);
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // Get current language
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const langCodes = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN'
        };
        recognition.lang = langCodes[currentLang] || 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            handleVoiceInput(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            updateVoiceButton();
        };

        recognition.onend = function() {
            isListening = false;
            updateVoiceButton();
        };

        return true;
    }
    return false;
}

// Text-to-Speech Function
function speak(text, callback) {
    // Use multilingual speak if available
    if (window.speak && typeof window.speak === 'function') {
        window.speak(text, callback);
        return;
    }
    
    if (synthesis.speaking) {
        synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Get current language from multilingual system
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const langCodes = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN'
    };
    utterance.lang = langCodes[currentLang] || 'en-US';

    if (callback) {
        utterance.onend = callback;
    }

    synthesis.speak(utterance);
}

// Start Mock Exam
function startMockExam() {
    console.log('Starting mock exam...');
    
    currentMockExam.isActive = true;
    currentMockExam.startTime = new Date();
    currentMockExam.currentQuestionIndex = 0;
    currentMockExam.answers = {};

    // Hide dashboard and show mock exam interface
    const dashboardSection = document.getElementById('dashboard-section');
    const mockExamInterface = document.getElementById('mock-exam-interface');
    
    console.log('Dashboard section:', dashboardSection);
    console.log('Mock exam interface:', mockExamInterface);
    
    if (dashboardSection) {
        dashboardSection.classList.remove('active');
        dashboardSection.style.display = 'none';
        console.log('Dashboard hidden');
    }
    
    if (mockExamInterface) {
        mockExamInterface.style.display = 'block';
        mockExamInterface.classList.add('active');
        console.log('Mock exam interface shown');
    }

    // Initialize speech recognition
    const speechInitialized = initSpeechRecognition();
    console.log('Speech recognition initialized:', speechInitialized);

    // Start timer
    startMockExamTimer();
    console.log('Timer started');

    // Load first question
    loadMockQuestion(0);
    console.log('First question loaded');

    // Speak welcome message using multilingual system
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    if (window.formatMessage) {
        const welcomeMsg = window.formatMessage('welcome', {
            duration: '10',
            questions: '5'
        });
        speak(welcomeMsg);
    } else {
        speak('Mock exam started. You have 10 minutes to complete 5 questions. Each question is worth 2 marks. I will now read the first question.');
    }
}

// Start Timer
function startMockExamTimer() {
    let timeRemaining = currentMockExam.timeLimit;
    const timerDisplay = document.getElementById('mock-exam-timer');

    currentMockExam.timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(currentMockExam.timerInterval);
            submitMockExam();
        }
    }, 1000);
}

// Load Mock Question
function loadMockQuestion(index) {
    if (index < 0 || index >= mockExamQuestions.length) return;

    const question = mockExamQuestions[index];
    currentMockExam.currentQuestionIndex = index;

    // Update question display
    document.getElementById('mock-current-q').textContent = index + 1;
    document.getElementById('mock-total-questions').textContent = mockExamQuestions.length;
    document.getElementById('mock-question-text').textContent = question.text;

    // Update navigation buttons
    document.getElementById('mock-prev-btn').disabled = index === 0;
    const nextBtn = document.getElementById('mock-next-btn');
    if (index === mockExamQuestions.length - 1) {
        nextBtn.textContent = 'Finish';
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Finish';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }

    // Load options or text input based on question type
    const optionsContainer = document.getElementById('mock-options-container');
    optionsContainer.innerHTML = '';

    if (question.type === 'mcq') {
        question.options.forEach((option, idx) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <div class="option-content">
                    <div class="option-letter">${String.fromCharCode(65 + idx)}</div>
                    <div class="option-text">${option}</div>
                </div>
            `;
            optionDiv.onclick = () => selectOption(idx);
            
            // Highlight if already selected
            if (currentMockExam.answers[question.id] === idx) {
                optionDiv.classList.add('selected');
            }
            
            optionsContainer.appendChild(optionDiv);
        });
    } else {
        // Text input for 2-mark questions
        const textInput = document.createElement('textarea');
        textInput.id = 'mock-text-answer-input';
        textInput.className = 'text-answer-input';
        textInput.placeholder = 'Type your answer here or use voice input...';
        textInput.rows = 3;
        textInput.value = currentMockExam.answers[question.id] || '';
        textInput.oninput = (e) => {
            currentMockExam.answers[question.id] = e.target.value;
        };
        optionsContainer.appendChild(textInput);
    }

    // Speak the question
    speakQuestion(question);
}

// Speak Question
function speakQuestion(question) {
    let questionText = `Question ${currentMockExam.currentQuestionIndex + 1} of ${mockExamQuestions.length}. ${question.text}`;
    
    if (question.type === 'mcq') {
        questionText += ' The options are: ';
        question.options.forEach((option, idx) => {
            questionText += `Option ${String.fromCharCode(65 + idx)}, ${option}. `;
        });
        questionText += ' Say the option letter to select your answer, or click on an option.';
    } else {
        questionText += ' This is a text answer question. Use the voice input button to speak your answer.';
    }

    speak(questionText);
}

// Select Option
function selectOption(index) {
    const question = mockExamQuestions[currentMockExam.currentQuestionIndex];
    currentMockExam.answers[question.id] = index;

    // Update UI
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === index) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });

    // Speak confirmation
    const optionLetter = String.fromCharCode(65 + index);
    speak(`Option ${optionLetter} selected. ${question.options[index]}`);
}

// Handle Voice Input
function handleVoiceInput(transcript) {
    const question = mockExamQuestions[currentMockExam.currentQuestionIndex];
    const lowerTranscript = transcript.toLowerCase().trim();

    console.log('Voice input received:', transcript);

    if (question.type === 'mcq') {
        // Handle MCQ voice selection
        const optionMatch = lowerTranscript.match(/option\s*([a-d])|([a-d])/i);
        if (optionMatch) {
            const letter = (optionMatch[1] || optionMatch[2]).toUpperCase();
            const index = letter.charCodeAt(0) - 65;
            if (index >= 0 && index < question.options.length) {
                selectOption(index);
            }
        }
    } else {
        // Handle text answer
        const textInput = document.getElementById('mock-text-answer-input');
        if (textInput) {
            textInput.value = transcript;
            currentMockExam.answers[question.id] = transcript;
            speak(`Your answer has been recorded: ${transcript}`);
        }
    }

    // Handle navigation commands
    if (lowerTranscript.includes('next')) {
        nextQuestion();
    } else if (lowerTranscript.includes('previous') || lowerTranscript.includes('back')) {
        previousQuestion();
    } else if (lowerTranscript.includes('repeat') || lowerTranscript.includes('read again')) {
        speakQuestion(question);
    }
}

// Voice Input Button
function toggleVoiceInput() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    if (isListening) {
        recognition.stop();
        isListening = false;
    } else {
        recognition.start();
        isListening = true;
        speak('Listening...');
    }

    updateVoiceButton();
}

// Update Voice Button
function updateVoiceButton() {
    const voiceBtn = document.getElementById('mock-voice-btn');
    if (voiceBtn) {
        if (isListening) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Listening';
            voiceBtn.style.background = '#fca5a5';
        } else {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Speak Answer';
            voiceBtn.style.background = 'linear-gradient(135deg, #93c5fd 0%, #bfdbfe 100%)';
        }
    }
}

// Previous Question
function previousQuestion() {
    if (currentMockExam.currentQuestionIndex > 0) {
        loadMockQuestion(currentMockExam.currentQuestionIndex - 1);
    }
}

// Next Question
function nextQuestion() {
    if (currentMockExam.currentQuestionIndex < mockExamQuestions.length - 1) {
        loadMockQuestion(currentMockExam.currentQuestionIndex + 1);
    } else {
        // Last question - show submit confirmation
        if (confirm('Are you sure you want to submit your exam?')) {
            submitMockExam();
        }
    }
}

// Submit Mock Exam
function submitMockExam() {
    clearInterval(currentMockExam.timerInterval);
    currentMockExam.isActive = false;

    // Calculate score
    let score = 0;
    let totalMarks = 0;

    mockExamQuestions.forEach(question => {
        totalMarks += question.marks;
        const userAnswer = currentMockExam.answers[question.id];

        if (question.type === 'mcq') {
            if (userAnswer === question.correctAnswer) {
                score += question.marks;
            }
        } else {
            // Simple text matching for demo
            if (userAnswer && userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())) {
                score += question.marks;
            }
        }
    });

    const percentage = Math.round((score / totalMarks) * 100);

    // Show results
    const resultMessage = `Exam submitted! You scored ${score} out of ${totalMarks} marks. That's ${percentage} percent.`;
    speak(resultMessage);

    alert(resultMessage);

    // Return to dashboard
    endMockExam();
}

// End Mock Exam
function endMockExam() {
    clearInterval(currentMockExam.timerInterval);
    currentMockExam.isActive = false;
    
    // Hide mock exam interface and show dashboard
    const mockExamInterface = document.getElementById('mock-exam-interface');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (mockExamInterface) {
        mockExamInterface.style.display = 'none';
        mockExamInterface.classList.remove('active');
    }
    
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
        dashboardSection.classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up voice button if it exists
    const voiceBtn = document.getElementById('mock-voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }

    // Set up navigation buttons
    const prevBtn = document.getElementById('mock-prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', previousQuestion);
    }

    const nextBtn = document.getElementById('mock-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }

    console.log('Enhanced mock exam initialized');
});

// Export functions for global use
window.startMockExam = startMockExam;
window.endMockExam = endMockExam;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.toggleVoiceInput = toggleVoiceInput;
window.submitMockExam = submitMockExam;

console.log('Enhanced mock exam functions exported to window');
console.log('window.startMockExam:', typeof window.startMockExam);
console.log('Enhanced-mock-exam.js loaded successfully!');

})(); // End of IIFE
