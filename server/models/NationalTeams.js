const mongoose = require('mongoose');

const nationalTeamSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'Country is required']
    },
    type: {
        type: String,
        required: true,
        enum: ['U17', 'U19', 'U21', 'A']
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive']
    },
});

const NationalTeam = mongoose.model('NationalTeam', nationalTeamSchema);
module.exports = NationalTeam;