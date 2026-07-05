const express = require('express');
const { like, unlike, likeStatus, getLikes, getUserLikes } = require('../controllers/likeController');
const likeValidation = require('../validation/likeValidation');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const AuthorizeOwner = require('../middleware/AuthorizeOwner');

const router = express.Router();

//! Like Menu Item
router.post("/like", Authenticate, likeValidation, like);

//! unlike Menu Item
router.post("/unlike", Authenticate, likeValidation, unlike);

//! Get MenuItem Like Status
router.get("/status/:user/:menuItem", Authenticate, AuthorizeOwner('user'), likeStatus);

//! Get Likes List
router.get("/getLikes/:menuItem", getLikes);
router.get("/userLikes/:id", Authenticate, AuthorizeOwner('id'), [ValidateObjectId], getUserLikes);


module.exports = router;
