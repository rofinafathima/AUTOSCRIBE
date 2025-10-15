// Teacher Dashboard JavaScript

let currentSection = 'dashboard';
let exams = [];
let scheduledExams = [];
let attendanceData = {};
let questionCounter = 0;
let createdExam = {
    name: '',
    duration: 60,
    description: '',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    questions: []
};

// Initialize teacher dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupEventListeners();
    loadExams();
    loadScheduledExams();
    setupFileUpload();
    setupTTSControls();
});

// Setup event listeners
function setupEventListeners() {
    // Speech rate and pitch controls
    document.getElementById('speech-rate').addEventListener('input', function() {
        document.getElementById('rate-value').textContent = this.value;
    });
    
    document.getElementById('speech-pitch').addEventListener('input', function() {
        document.getElementById('pitch-value').textContent = this.value;
    });
    
    // Auto-refresh dashboard every 30 seconds
    setInterval(loadDashboardData, 30000);
}

// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active class to clicked nav button
    event.target.classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'upload':
            loadExams();
            break;
        case 'schedule':
            loadScheduledExams();
            break;
        case 'attendance':
            loadAttendanceExams();
            break;
        case 'create':
            loadCreateExam();
            break;
    }
}
    }
}

// Schedule exam
function scheduleExam() {
    const examId = document.getElementById('schedule-exam-select').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const autoActivate = document.getElementById('auto-activate').checked;
    
    if (!examId || !startTime || !endTime) {
        alert('Please fill in all fields.');
        return;
    }
    
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
        alert('Exam not found.');
        return;
    }
    
    const scheduledExam = {
        id: Date.now().toString(),
        examId: examId,
        name: exam.name,
        startTime: startTime,
        endTime: endTime,
        status: autoActivate ? 'scheduled' : 'active',
        autoActivate: autoActivate
    };
    
    scheduledExams.push(scheduledExam);
    
    // Clear form
    document.getElementById('schedule-exam-select').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
    document.getElementById('auto-activate').checked = true;
    
    // Set up auto-activation if enabled
    if (autoActivate) {
        setupAutoActivation(scheduledExam);
    }
    
    loadScheduledExams();
    alert('Exam scheduled successfully!');
}

// Setup auto-activation
function setupAutoActivation(scheduledExam) {
    const startTime = new Date(scheduledExam.startTime);
    const endTime = new Date(scheduledExam.endTime);
    const now = new Date();
    
    // Activate exam at start time
    if (startTime > now) {
        const timeToStart = startTime.getTime() - now.getTime();
        setTimeout(() => {
            activateExam(scheduledExam.id);
        }, timeToStart);
    }
    
    // Deactivate exam at end time
    if (endTime > now) {
        const timeToEnd = endTime.getTime() - now.getTime();
        setTimeout(() => {
            deactivateExam(scheduledExam.id);
        }, timeToEnd);
    }
}

// Activate exam
function activateExam(scheduledExamId) {
    const exam = scheduledExams.find(e => e.id === scheduledExamId);
    if (exam) {
        exam.status = 'active';
        loadScheduledExams();
        console.log(`Exam "${exam.name}" activated automatically`);
    }
}

// Deactivate exam
function deactivateExam(scheduledExamId) {
    const exam = scheduledExams.find(e => e.id === scheduledExamId);
    if (exam) {
        exam.status = 'completed';
        loadScheduledExams();
        console.log(`Exam "${exam.name}" deactivated automatically`);
    }
}

// Load scheduled exams
function loadScheduledExams() {
    const container = document.getElementById('scheduled-exams-list');
    
    container.innerHTML = scheduledExams.map(exam => `
        <div class="scheduled-item">
            <h4>${exam.name}</h4>
            <p>Start: ${new Date(exam.startTime).toLocaleString()}</p>
            <p>End: ${new Date(exam.endTime).toLocaleString()}</p>
            <p>Status: <span class="status ${exam.status}">${exam.status}</span></p>
            <div class="exam-actions">
                <button onclick="activateExam('${exam.id}')" ${exam.status === 'active' ? 'disabled' : ''}>
                    Activate
                </button>
                <button onclick="deactivateExam('${exam.id}')" ${exam.status === 'completed' ? 'disabled' : ''}>
                    Deactivate
                </button>
            </div>
        </div>
    `).join('');
}

// Load attendance exams
function loadAttendanceExams() {
    updateExamSelects();
}

// Load attendance data
function loadAttendance() {
    const examId = document.getElementById('attendance-exam-select').value;
    
    if (!examId) {
        alert('Please select an exam.');
        return;
    }
    
    // Simulate loading attendance data
    const mockAttendance = generateMockAttendance(examId);
    displayAttendance(mockAttendance);
}

// Generate mock attendance data
function generateMockAttendance(examId) {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return { attendees: [], total: 0, percentage: 0 };
    
    const totalStudents = 150;
    const attendees = Math.floor(Math.random() * totalStudents * 0.8) + 20; // 20-140 students
    const percentage = Math.round((attendees / totalStudents) * 100);
    
    const studentList = [];
    for (let i = 1; i <= totalStudents; i++) {
        studentList.push({
            id: `STU${i.toString().padStart(3, '0')}`,
            name: `Student ${i}`,
            present: i <= attendees
        });
    }
    
    return {
        attendees: studentList,
        total: attendees,
        percentage: percentage
    };
}

// Display attendance data
function displayAttendance(data) {
    document.getElementById('total-attendees').textContent = data.total;
    document.getElementById('attendance-percentage').textContent = data.percentage + '%';
    
    const container = document.getElementById('attendance-list');
    container.innerHTML = data.attendees.map(student => `
        <div class="attendance-item">
            <div class="student-info">
                <i class="fas fa-user"></i>
                <div>
                    <strong>${student.name}</strong>
                    <p>ID: ${student.id}</p>
                </div>
            </div>
            <span class="status-badge ${student.present ? 'present' : 'absent'}">
                ${student.present ? 'Present' : 'Absent'}
            </span>
        </div>
    `).join('');
}

// Setup TTS controls
function setupTTSControls() {
    // TTS controls are already set up in setupEventListeners
}

// Preview speech
function previewSpeech() {
    const examName = document.getElementById('preview-exam-name').textContent;
    const examDate = document.getElementById('preview-exam-date').textContent;
    const examDuration = document.getElementById('preview-exam-duration').textContent;
    const difficulty = document.getElementById('preview-difficulty').textContent;
    
    const rate = parseFloat(document.getElementById('speech-rate').value);
    const pitch = parseFloat(document.getElementById('speech-pitch').value);
    
    const text = `Exam: ${examName}. ${examDate}. ${examDuration}. ${difficulty}. This is a preview of how the exam will sound to students.`;
    
    if (window.AutoscribeUtils) {
        window.AutoscribeUtils.speak(text, rate, pitch);
    }
}

// Stop speech
function stopSpeech() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// Logout function
function logout() {
    if (window.AutoscribeUtils) {
        window.AutoscribeUtils.clearUserData();
    }
    window.location.href = 'index.html';
}

// Initialize with demo data
function initializeSampleData() {
    // Load user data
    const userData = getUserData();
    if (userData && userData.type === 'teacher') {
        document.getElementById('teacher-name').textContent = `Welcome, ${userData.name}`;
        
        // Load teacher's exams
        const teacherExams = getExamsByTeacher(userData.id);
        exams = teacherExams.map(exam => ({
            id: exam.id,
            name: exam.name,
            date: exam.date,
            duration: exam.duration.toString(),
            description: exam.description,
            difficulty: exam.difficulty
        }));
        
        // Load scheduled exams
        scheduledExams = teacherExams
            .filter(exam => exam.scheduledStart)
            .map(exam => ({
                id: 's' + exam.id,
                examId: exam.id,
                name: exam.name,
                startTime: exam.scheduledStart.toISOString().slice(0, 16),
                endTime: exam.scheduledEnd.toISOString().slice(0, 16),
                status: exam.status,
                autoActivate: true
            }));
    }
}

// Initialize teacher dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load any existing exams from localStorage
    loadExams();
    
    // Initialize the dashboard
    loadDashboardData();
    loadRecentExams();
    loadUpcomingExams();
    loadScheduledExams();
    loadAttendanceExams();
    loadAttendance();
    setupTTSControls();
    
    // Show dashboard by default
    showSection('dashboard');
    
    console.log('Teacher dashboard initialized');
});

// Exam Creation Functions
function loadCreateExam() {
    // Initialize the create exam form
    document.getElementById('create-exam-name').value = createdExam.name;
    document.getElementById('create-exam-duration').value = createdExam.duration;
    document.getElementById('create-exam-description').value = createdExam.description;
    document.getElementById('create-exam-difficulty').value = createdExam.difficulty;
    document.getElementById('create-exam-type').value = createdExam.type;
    
    // Load existing questions
    loadQuestions();
}

function addQuestion() {
    questionCounter++;
    const questionId = `question_${questionCounter}`;
    
    const questionHTML = `
        <div class="question-item" id="${questionId}">
            <div class="question-header">
                <div class="question-number">${questionCounter}</div>
                <button class="delete-question-btn" onclick="deleteQuestion('${questionId}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            <input type="text" class="question-text-input" placeholder="Enter your question here..." 
                   onchange="updateQuestion('${questionId}', 'text', this.value)">
            <div class="options-container">
                <div class="option-item">
                    <div class="option-letter">A</div>
                    <input type="text" class="option-input" placeholder="Option A" 
                           onchange="updateQuestion('${questionId}', 'optionA', this.value)">
                </div>
                <div class="option-item">
                    <div class="option-letter">B</div>
                    <input type="text" class="option-input" placeholder="Option B" 
                           onchange="updateQuestion('${questionId}', 'optionB', this.value)">
                </div>
                <div class="option-item">
                    <div class="option-letter">C</div>
                    <input type="text" class="option-input" placeholder="Option C" 
                           onchange="updateQuestion('${questionId}', 'optionC', this.value)">
                </div>
                <div class="option-item">
                    <div class="option-letter">D</div>
                    <input type="text" class="option-input" placeholder="Option D" 
                           onchange="updateQuestion('${questionId}', 'optionD', this.value)">
                </div>
            </div>
            <div class="correct-option">
                <label>Correct Answer:</label>
                <select onchange="updateQuestion('${questionId}', 'correct', this.value)">
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('questions-list').insertAdjacentHTML('beforeend', questionHTML);
    
    // Add to created exam
    createdExam.questions.push({
        id: questionId,
        text: '',
        options: ['', '', '', ''],
        correct: 0
    });
}

function deleteQuestion(questionId) {
    const questionElement = document.getElementById(questionId);
    if (questionElement) {
        questionElement.remove();
        
        // Remove from created exam
        createdExam.questions = createdExam.questions.filter(q => q.id !== questionId);
        
        // Update question numbers
        updateQuestionNumbers();
    }
}

function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        const numberElement = question.querySelector('.question-number');
        if (numberElement) {
            numberElement.textContent = index + 1;
        }
    });
}

function updateQuestion(questionId, field, value) {
    const question = createdExam.questions.find(q => q.id === questionId);
    if (question) {
        if (field === 'text') {
            question.text = value;
        } else if (field.startsWith('option')) {
            const optionIndex = field.charAt(field.length - 1);
            const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            question.options[optionMap[optionIndex]] = value;
        } else if (field === 'correct') {
            question.correct = parseInt(value);
        }
    }
}

function loadQuestions() {
    const questionsList = document.getElementById('questions-list');
    questionsList.innerHTML = '';
    
    createdExam.questions.forEach((question, index) => {
        questionCounter = Math.max(questionCounter, index + 1);
        
        const questionHTML = `
            <div class="question-item" id="${question.id}">
                <div class="question-header">
                    <div class="question-number">${index + 1}</div>
                    <button class="delete-question-btn" onclick="deleteQuestion('${question.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <input type="text" class="question-text-input" placeholder="Enter your question here..." 
                       value="${question.text}" onchange="updateQuestion('${question.id}', 'text', this.value)">
                <div class="options-container">
                    <div class="option-item">
                        <div class="option-letter">A</div>
                        <input type="text" class="option-input" placeholder="Option A" 
                               value="${question.options[0]}" onchange="updateQuestion('${question.id}', 'optionA', this.value)">
                    </div>
                    <div class="option-item">
                        <div class="option-letter">B</div>
                        <input type="text" class="option-input" placeholder="Option B" 
                               value="${question.options[1]}" onchange="updateQuestion('${question.id}', 'optionB', this.value)">
                    </div>
                    <div class="option-item">
                        <div class="option-letter">C</div>
                        <input type="text" class="option-input" placeholder="Option C" 
                               value="${question.options[2]}" onchange="updateQuestion('${question.id}', 'optionC', this.value)">
                    </div>
                    <div class="option-item">
                        <div class="option-letter">D</div>
                        <input type="text" class="option-input" placeholder="Option D" 
                               value="${question.options[3]}" onchange="updateQuestion('${question.id}', 'optionD', this.value)">
                    </div>
                </div>
                <div class="correct-option">
                    <label>Correct Answer:</label>
                    <select onchange="updateQuestion('${question.id}', 'correct', this.value)">
                        <option value="0" ${question.correct === 0 ? 'selected' : ''}>A</option>
                        <option value="1" ${question.correct === 1 ? 'selected' : ''}>B</option>
                        <option value="2" ${question.correct === 2 ? 'selected' : ''}>C</option>
                        <option value="3" ${question.correct === 3 ? 'selected' : ''}>D</option>
                    </select>
                </div>
            </div>
        `;
        
        questionsList.insertAdjacentHTML('beforeend', questionHTML);
    });
}

function saveCreatedExam() {
    // Get exam information
    createdExam.name = document.getElementById('create-exam-name').value;
    createdExam.duration = parseInt(document.getElementById('create-exam-duration').value);
    createdExam.description = document.getElementById('create-exam-description').value;
    createdExam.difficulty = document.getElementById('create-exam-difficulty').value;
    createdExam.type = document.getElementById('create-exam-type').value;
    
    // Validate
    if (!createdExam.name.trim()) {
        alert('Please enter an exam name.');
        return;
    }
    
    if (createdExam.questions.length === 0) {
        alert('Please add at least one question.');
        return;
    }
    
    // Validate questions
    for (let i = 0; i < createdExam.questions.length; i++) {
        const question = createdExam.questions[i];
        if (!question.text.trim()) {
            alert(`Please enter text for question ${i + 1}.`);
            return;
        }
        
        const hasOptions = question.options.some(option => option.trim() !== '');
        if (!hasOptions) {
            alert(`Please add options for question ${i + 1}.`);
            return;
        }
    }
    
    // Create new exam object
    const newExam = {
        id: 'EXAM' + Date.now(),
        name: createdExam.name,
        teacherId: getUserData().id,
        date: new Date().toISOString().split('T')[0],
        duration: createdExam.duration,
        description: createdExam.description,
        difficulty: createdExam.difficulty,
        status: 'available',
        questions: createdExam.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correct: q.correct
        })),
        createdAt: new Date(),
        scheduledStart: null,
        scheduledEnd: null
    };
    
    // Add to exams array
    exams.push(newExam);
    
    // Update exam select dropdowns
    updateExamSelects();
    
    // Clear the form
    clearExam();
    
    alert('Exam created successfully!');
    
    // Switch to dashboard to see the new exam
    showSection('dashboard');
    loadDashboardData();
}

function previewCreatedExam() {
    // Get exam information
    createdExam.name = document.getElementById('create-exam-name').value;
    createdExam.duration = parseInt(document.getElementById('create-exam-duration').value);
    createdExam.description = document.getElementById('create-exam-description').value;
    createdExam.difficulty = document.getElementById('create-exam-difficulty').value;
    createdExam.type = document.getElementById('create-exam-type').value;
    
    if (!createdExam.name.trim()) {
        alert('Please enter an exam name to preview.');
        return;
    }
    
    // Create preview content
    let previewContent = `
        <h2>${createdExam.name}</h2>
        <p><strong>Duration:</strong> ${createdExam.duration} minutes</p>
        <p><strong>Difficulty:</strong> ${createdExam.difficulty}</p>
        <p><strong>Type:</strong> ${createdExam.type}</p>
        <p><strong>Description:</strong> ${createdExam.description}</p>
        <hr>
        <h3>Questions (${createdExam.questions.length})</h3>
    `;
    
    createdExam.questions.forEach((question, index) => {
        previewContent += `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h4>Question ${index + 1}</h4>
                <p>${question.text || '[No question text]'}</p>
                <ul>
                    ${question.options.map((option, optIndex) => `
                        <li style="color: ${optIndex === question.correct ? 'green' : 'black'}; font-weight: ${optIndex === question.correct ? 'bold' : 'normal'}">
                            ${String.fromCharCode(65 + optIndex)}. ${option || '[No option text]'}
                            ${optIndex === question.correct ? ' ✓' : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    // Show preview in a modal or new window
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
        <html>
            <head>
                <title>Exam Preview - ${createdExam.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { color: #333; }
                    h3 { color: #666; }
                    h4 { color: #888; }
                </style>
            </head>
            <body>
                ${previewContent}
            </body>
        </html>
    `);
    previewWindow.document.close();
}

function clearExam() {
    // Reset form
    document.getElementById('create-exam-name').value = '';
    document.getElementById('create-exam-duration').value = '60';
    document.getElementById('create-exam-description').value = '';
    document.getElementById('create-exam-difficulty').value = 'Medium';
    document.getElementById('create-exam-type').value = 'Multiple Choice';
    
    // Clear questions
    document.getElementById('questions-list').innerHTML = '';
    createdExam.questions = [];
    questionCounter = 0;
    
    // Reset created exam object
    createdExam = {
        name: '',
        duration: 60,
        description: '',
        difficulty: 'Medium',
        type: 'Multiple Choice',
        questions: []
    };
}
