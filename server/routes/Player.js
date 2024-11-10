const { create } = require('../controllers/Player');

const router = require('express').Router();

router.post('/', create);

module.exports = router;