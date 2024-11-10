const Player = require('../models/Player');

module.exports = {

    async create (req, res) {
        
        const { name, dateOfBirth, position, currentClub, country, nationalTeams, previousClubs, rating } = req.body;

        if (!name || !dateOfBirth || !position || !currentClub || !country || !rating) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        try {
            const player = await Player.create({ name, dateOfBirth, position, currentClub, country, nationalTeams, previousClubs, rating });
            return res.status(201).json(player);
        } catch (error) {
            return res.status(400).json(error);
        }
        
    },

}