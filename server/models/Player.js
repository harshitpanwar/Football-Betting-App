const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date }
});

const NationalTeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    from: { type: Date, required: true }
});

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
    currentClub: {
        club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
        from: { type: Date, required: true }
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    nationalTeams: [NationalTeamSchema],
    previousClubs: [ClubSchema],
    rating: { type: Number, min: 1, max: 5 }
});

// Models for related collections
const Position = mongoose.model('Position', new mongoose.Schema({ name: String }));
const Club = mongoose.model('Club', new mongoose.Schema({ name: String }));
const Country = mongoose.model('Country', new mongoose.Schema({ name: String }));

module.exports = mongoose.model('Player', PlayerSchema);
