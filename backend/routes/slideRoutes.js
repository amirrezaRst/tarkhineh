const express = require('express');
const router = express.Router();
const { getActiveSlides } = require('../controllers/slideController');

router.get("/", getActiveSlides);

module.exports = router;
