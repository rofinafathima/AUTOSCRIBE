// Demo data for Autoscribe platform

// Sample teacher data
const demoTeachers = [
    {
        id: 'T001',
        email: 'teacher1@autoscribe.edu',
        password: 'teacher123',
        name: 'Dr. Sarah Johnson',
        department: 'Mathematics'
    },
    {
        id: 'T002',
        email: 'teacher2@autoscribe.edu',
        password: 'teacher123',
        name: 'Prof. Michael Chen',
        department: 'Science'
    }
];

// Sample student data
const demoStudents = [
    {
        id: 'STU001',
        password: 'student123',
        name: 'Alex Thompson',
        email: 'alex@student.edu',
        class: 'Grade 10A'
    },
    {
        id: 'STU002',
        password: 'student123',
        name: 'Maria Garcia',
        email: 'maria@student.edu',
        class: 'Grade 10B'
    },
    {
        id: 'STU003',
        password: 'student123',
        name: 'David Wilson',
        email: 'david@student.edu',
        class: 'Grade 11A'
    }
];


// Sample exam data
const demoExams = [
    {
        id: 'EXAM001',
        name: 'Mathematics Quiz - Algebra',
        teacherId: 'T001',
        date: '2024-01-15',
        duration: 60,
        description: 'Basic algebra and linear equations',
        difficulty: 'Medium',
        status: 'available',
        questions: [
            {
                id: 1,
                text: 'What is the value of x in the equation 2x + 5 = 13?',
                options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
                correct: 0,
                explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
            },
            {
                id: 2,
                text: 'Simplify the expression: 3(x + 2) - 2x',
                options: ['x + 6', 'x + 2', '5x + 6', '3x + 4'],
                correct: 0,
                explanation: 'Distribute: 3x + 6 - 2x = x + 6'
            },
            {
                id: 3,
                text: 'What is the slope of the line y = 2x + 3?',
                options: ['2', '3', '5', '6'],
                correct: 0,
                explanation: 'In the form y = mx + b, m is the slope, which is 2'
            }
        ],
        createdAt: new Date('2024-01-10'),
        scheduledStart: null,
        scheduledEnd: null
    },
    {
        id: 'EXAM002',
        name: 'Science Test - Physics',
        teacherId: 'T002',
        date: '2024-01-20',
        duration: 90,
        description: 'Motion, forces, and energy concepts',
        difficulty: 'Hard',
        status: 'scheduled',
        questions: [
            {
                id: 1,
                text: 'What is the unit of force in the International System of Units?',
                options: ['Joule', 'Newton', 'Watt', 'Pascal'],
                correct: 1,
                explanation: 'Force is measured in Newtons (N) in the SI system'
            },
            {
                id: 2,
                text: 'What is the acceleration due to gravity on Earth?',
                options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
                correct: 0,
                explanation: 'The standard acceleration due to gravity on Earth is 9.8 m/s²'
            },
            {
                id: 3,
                text: 'Which law states that for every action, there is an equal and opposite reaction?',
                options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Conservation of Energy'],
                correct: 2,
                explanation: 'Newton\'s Third Law describes action-reaction pairs'
            }
        ],
        createdAt: new Date('2024-01-12'),
        scheduledStart: new Date('2024-01-20T10:00:00'),
        scheduledEnd: new Date('2024-01-20T11:30:00')
    },
    {
        id: 'EXAM003',
        name: 'English Literature Quiz',
        teacherId: 'T001',
        date: '2024-01-18',
        duration: 45,
        description: 'Shakespeare and poetry analysis',
        difficulty: 'Medium',
        status: 'completed',
        questions: [
            {
                id: 1,
                text: 'Who wrote "Romeo and Juliet"?',
                options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
                correct: 1,
                explanation: 'William Shakespeare wrote the famous tragedy "Romeo and Juliet"'
            },
            {
                id: 2,
                text: 'What type of poem has 14 lines and follows a specific rhyme scheme?',
                options: ['Haiku', 'Sonnet', 'Limerick', 'Free verse'],
                correct: 1,
                explanation: 'A sonnet is a 14-line poem with a specific rhyme scheme'
            }
        ],
        createdAt: new Date('2024-01-05'),
        scheduledStart: new Date('2024-01-18T14:00:00'),
        scheduledEnd: new Date('2024-01-18T14:45:00')
    }
];

// Sample attendance data
const demoAttendance = {
    'EXAM001': {
        examId: 'EXAM001',
        examName: 'Mathematics Quiz - Algebra',
        totalStudents: 25,
        attendees: [
            { studentId: 'STU001', name: 'Alex Thompson', present: true, startTime: '10:05', endTime: '10:58' },
            { studentId: 'STU002', name: 'Maria Garcia', present: true, startTime: '10:02', endTime: '10:55' },
            { studentId: 'STU003', name: 'David Wilson', present: false, startTime: null, endTime: null }
        ],
        attendanceRate: 80
    },
    'EXAM003': {
        examId: 'EXAM003',
        examName: 'English Literature Quiz',
        totalStudents: 25,
        attendees: [
            { studentId: 'STU001', name: 'Alex Thompson', present: true, startTime: '14:03', endTime: '14:42' },
            { studentId: 'STU002', name: 'Maria Garcia', present: true, startTime: '14:01', endTime: '14:44' },
            { studentId: 'STU003', name: 'David Wilson', present: true, startTime: '14:05', endTime: '14:43' }
        ],
        attendanceRate: 100
    }
};

// Sample exam results
const demoResults = {
    'STU001': {
        'EXAM001': { score: 85, answers: { 1: 0, 2: 0, 3: 0 }, timeSpent: 53 },
        'EXAM003': { score: 90, answers: { 1: 1, 2: 1 }, timeSpent: 39 }
    },
    'STU002': {
        'EXAM001': { score: 75, answers: { 1: 0, 2: 1, 3: 0 }, timeSpent: 55 },
        'EXAM003': { score: 95, answers: { 1: 1, 2: 1 }, timeSpent: 41 }
    },
    'STU003': {
        'EXAM003': { score: 80, answers: { 1: 1, 2: 0 }, timeSpent: 38 }
    }
};

// Utility functions for demo data
function getTeacherByEmail(email) {
    return demoTeachers.find(teacher => teacher.email === email);
}

function getStudentById(id) {
    return demoStudents.find(student => student.id === id);
}


function getExamsByTeacher(teacherId) {
    return demoExams.filter(exam => exam.teacherId === teacherId);
}

function getAvailableExams() {
    return demoExams.filter(exam => exam.status === 'available');
}

function getScheduledExams() {
    return demoExams.filter(exam => exam.status === 'scheduled');
}

function getCompletedExams() {
    return demoExams.filter(exam => exam.status === 'completed');
}

function getExamById(examId) {
    return demoExams.find(exam => exam.id === examId);
}

function getAttendanceByExam(examId) {
    return demoAttendance[examId] || null;
}

function getStudentResults(studentId) {
    return demoResults[studentId] || {};
}

// Make functions globally available
window.getTeacherByEmail = getTeacherByEmail;
window.getStudentById = getStudentById;
window.getExamsByTeacher = getExamsByTeacher;
window.getAvailableExams = getAvailableExams;
window.getScheduledExams = getScheduledExams;
window.getCompletedExams = getCompletedExams;
window.getExamById = getExamById;
window.getAttendanceByExam = getAttendanceByExam;
window.getStudentResults = getStudentResults;

// Debug: Log that demo data is loaded
console.log('Demo data loaded successfully');
console.log('Available students:', demoStudents.map(s => ({ id: s.id, name: s.name })));
console.log('Available teachers:', demoTeachers.map(t => ({ email: t.email, name: t.name })));

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        demoTeachers,
        demoStudents,
        demoExams,
        demoAttendance,
        demoResults,
        getTeacherByEmail,
        getStudentById,
        getExamsByTeacher,
        getAvailableExams,
        getScheduledExams,
        getCompletedExams,
        getExamById,
        getAttendanceByExam,
        getStudentResults
    };
}
