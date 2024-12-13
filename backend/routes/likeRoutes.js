const express = require('express');
const { like, unlike, likeStatus, getLikes } = require('../controllers/likeController');
const likeValidation = require('../validation/likeValidation');

const router = express.Router();

//! Like Menu Item
router.post("/like", likeValidation, like);

//! unlike Menu Item
router.post("/unlike", likeValidation, unlike);

//! Get MenuItem Like Status
router.get("/status/:user/:menuItem", likeStatus);

//! Get Likes List
router.get("/getLikes/:menuItem", getLikes);


module.exports = router;