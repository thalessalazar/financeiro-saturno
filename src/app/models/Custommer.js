const mongoose = require('../../database/database');

const CustommerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        dafault: Date.now()
    }
});

const Custommer = mongoose.model('Custommer', CustommerSchema);

module.exports = Custommer;