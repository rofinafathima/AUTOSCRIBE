const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    correctAnswer: String,
    marks: {
        type: Number,
        default: 1
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    type: {
        type: String,
        enum: ['practice', 'quiz', 'midterm', 'final'],
        default: 'quiz'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        trim: true
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
examSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
