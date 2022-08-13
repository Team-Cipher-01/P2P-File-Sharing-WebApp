const router = require('express').Router();
const { Manager } = require('../../components/search');

router.post('/get-results', Manager.getSearchData);

module.exports = router;
