const Club = require('../models/ClubTeam');

module.exports = {

    // create a new club
    async create(req, res) {
        try {
            const name = req.body.name;
            if (!name) {
                return res.status(400).send({ message: 'Club name is required' });
            }
            const existingClub = await Club.findOne({
                name
            });
            if (existingClub) {
                return res.status(409).send({ message: 'Club already exists' });
            }
            const club = await Club.create({ name, status: 'Active' });
            return res.status(201).send(club);
        } catch (error) {
            return res.status(400).send(error);
        }
    },

    // fetch all clubs
    async fetchAll(req, res) {
        try {
            const { page, perPage, search } = req.query;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(perPage, 10) || 10,
                search: search || ''
            };
            const clubs = await Club.find({
                name: { $regex: options.search, $options: 'i' }
            }).skip(options.limit * (options.page - 1)).limit(options.limit);
            const total = await Club.countDocuments();
            return res.status(200).send({
                clubs,
                total,
                page: options.page,
                perPage: options.limit
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    },

    async fetchAllActive(req, res) {
        try {
            const clubs = await Club.find({ status: 'Active' });
            return res.status(200).send(clubs);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    // fetch a single club
    async fetch(req, res) {
        try {
            const club = await Club.findById(req.params.id);
            if (!club) {
                return res.status(404).send({ message: 'Club not found' });
            }
            return res.status(200).send(club);
        } catch (error) {
            return res.status(400).send(error);
        }
    },

    // update a club
    async update(req, res) {
        try {
            const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!club) {
                return res.status(404).send({ message: 'Club not found' });
            }
            return res.status(200).send(club);
        } catch (error) {
            return res.status(400).send(error);
        }
    },

    // delete a club
    async delete(req, res) {
        try {
            const club = await Club.findByIdAndDelete(req.params.id);
            if (!club) {
                return res.status(404).send({ message: 'Club not found' });
            }
            return res.status(200).send({ message: 'Club deleted successfully' });
        } catch (error) {
            return res.status(400).send(error);
        }
    },


}