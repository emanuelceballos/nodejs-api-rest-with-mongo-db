const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autorSchema = new mongoose.Schema({
    name: String,
    email: String
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: autorSchema,
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    students: {
        type: Number,
        default: 0
    },
    mark: {
        type: Number
    }
});

module.exports = mongoose.model('Course', courseSchema);