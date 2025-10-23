// Student Exam Script
let currentExam = null;
let currentQuestionIndex = 0;
let answers = {};
let timerInterval = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data
    // initializeSampleData(); // Commented out - not needed
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize UI
    document.getElementById('student-name').textContent = currentUser.name;
    
    // Load data and set up event listeners
    loadAvailableExams();
    loadSubmissions();
    setupEventListeners();
    loadMockExams();
});

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('startExamBtn')?.addEventListener('click', startExam);
    document.getElementById('prevBtn')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('nextBtn')?.addEventListener('click', showNextQuestion);
    document.getElementById('submitExamBtn')?.addEventListener('click', showSubmitConfirm);
    document.getElementById('confirmSubmitBtn')?.addEventListener('click', submitExam);
    document.getElementById('cancelSubmitBtn')?.addEventListener('click', () => {
        document.getElementById('submitConfirmModal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('submissionDetailsModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('submissionDetailsModal').style.display = 'none';
            document.getElementById('submitConfirmModal').style.display = 'none';
        }
    });
}

// Load mock exams dynamically
function loadMockExams() {
    const mockExamList = document.getElementById('mockExamList');
    if (!mockExamList) return;

    // Example mock exams array if not defined
    if (typeof MOCK_EXAMS === 'undefined') {
        window.MOCK_EXAMS = [
            {
                id: 'mock1',
                title: 'Math Practice Exam',
                subject: 'Mathematics',
                duration: 5, // minutes
                questions: [
                    { id: 'q1', text: 'What is 2 + 2?', type: 'mcq', options: ['3', '4', '5', '6'], correctAnswer: 'B', marks: 2 }
                ]
            }
        ];
    }

    mockExamList.innerHTML = MOCK_EXAMS.map(exam => `
        <div class="mock-exam-card">
            <h3>${exam.title} <span class="practice-badge">Practice</span></h3>
            <div class="mock-exam-meta">
                <span><i class="fas fa-book"></i> ${exam.subject}</span>
                <span><i class="far fa-clock"></i> ${exam.duration} min</span>
                <span><i class="fas fa-question-circle"></i> ${exam.questions.length} questions</span>
            </div>
            <p>Practice with this ${exam.subject} exam to test your knowledge.</p>
            <button class="btn btn-outline" onclick="startMockExamFromList('${exam.id}')">
                <i class="fas fa-play"></i> Start Practice
            </button>
        </div>
    `).join('');
}

// Start mock exam (OLD VERSION - RENAMED TO AVOID CONFLICT WITH ENHANCED VERSION)
function startMockExamFromList(examId) {
    const exam = MOCK_EXAMS.find(e => e.id === examId);
    if (!exam) return;

    currentExam = { ...exam, isMock: true };
    currentQuestionIndex = 0;
    answers = {};

    // Show exam section, hide dashboard
    document.getElementById('dashboard-section').classList.remove('active');
    document.getElementById('exam-section').classList.add('active');

    // Update exam title and meta
    document.getElementById('exam-title').textContent = exam.title + ' (Practice)';
    document.getElementById('exam-subject').textContent = exam.subject;
    document.getElementById('exam-duration').textContent = `${exam.duration} min`;

    // Load first question
    showQuestion(currentQuestionIndex);

    // Start timer
    startExamTimer(exam.duration * 60); // Convert minutes to seconds
}

// Show question
function showQuestion(index) {
    if (!currentExam || !currentExam.questions[index]) return;
    const question = currentExam.questions[index];
    currentQuestionIndex = index;

    document.getElementById('question-number').textContent = index + 1;
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('question-marks').textContent = question.marks;
    document.getElementById('total-questions').textContent = currentExam.questions.length;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + i)}) ${opt}`;
        btn.onclick = () => selectOption(i);
        optionsContainer.appendChild(btn);
    });
}

// Select option
function selectOption(index) {
    if (!currentExam) return;
    const question = currentExam.questions[currentQuestionIndex];
    answers[question.id] = { answer: String.fromCharCode(65 + index) };
    alert(`You selected option ${String.fromCharCode(65 + index)}`);
}

// Start exam timer
function startExamTimer(seconds) {
    const timerElem = document.getElementById('exam-time');
    let remaining = seconds;

    timerInterval = setInterval(() => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerElem.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        remaining--;
        if (remaining < 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

// Save answer
function saveAnswer() {
    // Already handled in selectOption
}

// Submit exam
function submitExam() {
    saveAnswer();

    if (currentExam && currentExam.isMock) {
        let score = 0;
        let totalMarks = 0;

        currentExam.questions.forEach(q => {
            totalMarks += q.marks;
            const answer = answers[q.id];
            if (answer && answer.answer === q.correctAnswer) score += q.marks;
        });

        const percentage = Math.round((score / totalMarks) * 100);
        alert(`Practice exam completed! Score: ${score}/${totalMarks} (${percentage}%)`);

        // Return to dashboard
        document.getElementById('exam-section').classList.remove('active');
        document.getElementById('dashboard-section').classList.add('active');

        if (timerInterval) clearInterval(timerInterval);
        currentExam = null;
        answers = {};
    } else {
        // Original exam submission logic here...
    }
}

// Navigation functions
function showNextQuestion() {
    if (!currentExam) return;
    if (currentQuestionIndex < currentExam.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

function showPreviousQuestion() {
    if (!currentExam) return;
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

// Language selection function
function selectLanguage(languageCode) {
    if (window.changeExamLanguage) {
        window.changeExamLanguage(languageCode);
        
        // Update display
        const languageNames = {
            'en': 'English',
            'hi': 'हिन्दी',
            'ta': 'தமிழ்'
        };
        
        const displayElement = document.getElementById('current-language-display');
        if (displayElement) {
            displayElement.textContent = languageNames[languageCode] || 'English';
        }
        
        // Show confirmation
        alert(`Language changed to ${languageNames[languageCode]}. Voice commands will now work in this language.`);
        
        // Return to dashboard
        const languageSection = document.getElementById('language-section');
        const dashboardSection = document.getElementById('dashboard-section');
        if (languageSection && dashboardSection) {
            languageSection.classList.remove('active');
            dashboardSection.classList.add('active');
        }
    }
}

// Change language function
function changeLanguage() {
    const dashboardSection = document.getElementById('dashboard-section');
    const languageSection = document.getElementById('language-section');
    
    if (dashboardSection && languageSection) {
        dashboardSection.classList.remove('active');
        languageSection.classList.add('active');
    }
}

// Refresh exams
function refreshExams() {
    if (window.loadStudentExams) {
        window.loadStudentExams();
        alert('Exams refreshed!');
    } else {
        loadAvailableExams();
        alert('Exams refreshed!');
    }
}

// Test microphone
function testMicrophone() {
    if (window.speak) {
        window.speak('Microphone test. If you can hear this, your microphone is working correctly.');
    } else {
        alert('Testing microphone... Please check your browser console.');
    }
}

// Show help
function showHelp() {
    const dashboardSection = document.getElementById('dashboard-section');
    const helpSection = document.getElementById('help-section');
    
    if (dashboardSection && helpSection) {
        dashboardSection.classList.remove('active');
        helpSection.classList.add('active');
    }
}

// Load available exams
function loadAvailableExams() {
    // This will be handled by exam-connector.js
    if (window.loadStudentExams) {
        window.loadStudentExams();
    }
}

// Load submissions
function loadSubmissions() {
    // This will be handled by exam-connector.js
    console.log('Loading student submissions...');
}

// Export functions globally
window.startMockExam = startMockExam;
window.startExam = startExam;
window.showNextQuestion = showNextQuestion;
window.showPreviousQuestion = showPreviousQuestion;
window.submitExam = submitExam;
window.selectOption = selectOption;
window.selectLanguage = selectLanguage;
window.changeLanguage = changeLanguage;
window.refreshExams = refreshExams;
window.testMicrophone = testMicrophone;
window.showHelp = showHelp;
window.loadAvailableExams = loadAvailableExams;
window.loadSubmissions = loadSubmissions;
