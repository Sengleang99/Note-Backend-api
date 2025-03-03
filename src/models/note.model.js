const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        default: [],
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: new Date().getTime()
    }
});

const NoteModel = mongoose.model('notes', noteSchema);

module.exports = NoteModel;