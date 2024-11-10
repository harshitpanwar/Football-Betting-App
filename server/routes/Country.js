const { fetchAll } = require('../controllers/Country');

const router = require('express').Router();

router.get('/', fetchAll);

module.exports = router;