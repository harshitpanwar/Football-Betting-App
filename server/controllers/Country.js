const Country = require('../models/Country');

module.exports = {

    // get all countries
    async fetchAll(req, res) {
        try {
            const countries = await Country.find();
            return res.status(200).send(countries);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

}