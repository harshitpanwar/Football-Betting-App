const { create, fetchAll, fetch, update, delete: deleteClub, fetchAllActive } = require('../controllers/Club');

const router = require('express').Router();

router.post('/', create);
router.get('/', fetchAll);
router.get('/active', fetchAllActive);
router.get('/:id', fetch);
router.put('/:id', update);
router.delete('/:id', deleteClub);

module.exports = router;