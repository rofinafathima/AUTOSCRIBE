// Mock Exam Questions
const mockExamQuestions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        marks: 2
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        marks: 2
    },
    {
        id: 3,
        question: "What is 7 x 8?",
        options: ["48", "56", "64", "72"],
        correctAnswer: 1,
        marks: 2
    },
    {
        id: 4,
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: 1,
        marks: 2
    },
    {
        id: 5,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        marks: 2
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(mockExamQuestions.length).fill(null);
let examTimer;
let timeLeft = 600; // 10 minutes in seconds

// DOM Elements - will be initialized after DOM loads
let mockExamSection;
let mockExamInterface;
let questionText;
let optionsContainer;
let currentQ;
let totalQuestions;
let nextBtn;
let prevBtn;
let submitBtn;
let voiceBtn;
let voiceStatus;
let timerDisplay;
let currentPosition;

// Initialize the exam
function initMockExam() {
    totalQuestions.textContent = mockExamQuestions.length;
    displayQuestion(0);
    startTimer();
}

// Display question
function displayQuestion(index) {
    if (index < 0 || index >= mockExamQuestions.length) return;
    
    currentQuestionIndex = index;
    const question = mockExamQuestions[index];
    
    questionText.textContent = question.question;
    currentQ.textContent = index + 1;
    if (currentPosition) currentPosition.textContent = index + 1;
    
    // Update options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, i) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn' + (userAnswers[index] === i ? ' selected' : '');
        optionBtn.innerHTML = `${String.fromCharCode(65 + i)}) ${option}`;
        optionBtn.onclick = () => selectOption(i);
        optionsContainer.appendChild(optionBtn);
    });
    
    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === mockExamQuestions.length - 1;
    
    // Update submit button if all questions are answered
    updateSubmitButton();
}

// Select an option
function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    displayQuestion(currentQuestionIndex);
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < mockExamQuestions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
    }
}

// Start the mock exam
function startMockExam() {
    mockExamSection.style.display = 'none';
    mockExamInterface.style.display = 'block';
    initMockExam();
}

// End the mock exam
function endMockExam() {
    if (confirm('Are you sure you want to end the exam? Your progress will be saved.')) {
        clearInterval(examTimer);
        submitMockExam();
    }
}

// Submit the mock exam
function submitMockExam() {
    clearInterval(examTimer);
    
    // Calculate score
    let score = 0;
    let totalMarks = 0;
    
    userAnswers.forEach((answer, index) => {
        if (answer === mockExamQuestions[index].correctAnswer) {
            score += mockExamQuestions[index].marks;
        }
        totalMarks += mockExamQuestions[index].marks;
    });
    
    const percentage = Math.round((score / totalMarks) * 100);
    
    // Show results
    alert(`Exam submitted!\nYour score: ${score}/${totalMarks} (${percentage}%)`);
    
    // Reset and go back to exam list
    mockExamInterface.style.display = 'none';
    mockExamSection.style.display = 'block';
    resetExam();
}

// Update submit button state
function updateSubmitButton() {
    const allAnswered = userAnswers.every(answer => answer !== null);
    submitBtn.disabled = !allAnswered;
}

// Timer functions
function startTimer() {
    updateTimerDisplay();
    examTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(examTimer);
            alert('Time\'s up! Submitting your exam...');
            submitMockExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Voice recognition
function setupVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        voiceBtn.disabled = true;
        voiceStatus.innerHTML = '<i class="fas fa-times-circle"></i> Voice input not supported';
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.onclick = () => {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
            return;
        }
        
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        voiceStatus.innerHTML = '<i class="fas fa-circle recording"></i> Listening...';
        
        recognition.start();
    };
    
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        processVoiceCommand(speechResult);
    };
    
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Speak Answer';
        voiceStatus.innerHTML = '<i class="fas fa-circle"></i> Ready';
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: ' + event.error;
    };
}

// Process voice commands
function processVoiceCommand(command) {
    // Check for option selection (e.g., "A", "B", "C", "D")
    const optionMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    const optionKey = command.toLowerCase().charAt(0);
    
    if (optionKey in optionMap) {
        const optionIndex = optionMap[optionKey];
        if (optionIndex < mockExamQuestions[currentQuestionIndex].options.length) {
            selectOption(optionIndex);
            return;
        }
    }
    
    // Navigation commands
    if (command.includes('next') || command.includes('next question')) {
        nextQuestion();
    } else if (command.includes('previous') || command.includes('previous question')) {
        previousQuestion();
    } else if (command.includes('submit') || command.includes('finish')) {
        submitMockExam();
    } else if (command.includes('exit') || command.includes('end')) {
        endMockExam();
    }
}

// Reset exam state
function resetExam() {
    currentQuestionIndex = 0;
    userAnswers = new Array(mockExamQuestions.length).fill(null);
    timeLeft = 600;
    clearInterval(examTimer);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    mockExamSection = document.getElementById('mock-exam-section');
    mockExamInterface = document.getElementById('mock-exam-interface');
    questionText = document.getElementById('question-text');
    optionsContainer = document.getElementById('options-container');
    currentQ = document.getElementById('current-q');
    totalQuestions = document.getElementById('total-questions');
    nextBtn = document.getElementById('next-btn');
    prevBtn = document.getElementById('prev-btn');
    submitBtn = document.getElementById('submit-exam-btn');
    voiceBtn = document.getElementById('voice-btn');
    voiceStatus = document.getElementById('voice-status');
    timerDisplay = document.getElementById('mock-exam-timer');
    currentPosition = document.getElementById('current-position');
    
    // Only initialize if we're on the dashboard page
    if (mockExamSection && voiceBtn) {
        setupVoiceRecognition();
    }
});

// Make functions available globally
window.startMockExam = startMockExam;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitMockExam = submitMockExam;
window.endMockExam = endMockExam;
