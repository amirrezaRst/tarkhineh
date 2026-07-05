const express = require('express');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const { createReview, getReview, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { createReviewValidation, updateReviewValidation } = require('../validation/reviewValidation');
const Authenticate = require('../middleware/Authenticate');

const router = express.Router();

router.route("/")
    .post(Authenticate, createReviewValidation, createReview);

router.get("/allReviews/:id", getAllReviews)

router
    .route('/:id')
    .get(ValidateObjectId, getReview)
    .put(Authenticate, ValidateObjectId, updateReviewValidation, updateReview)
    .delete(Authenticate, ValidateObjectId, deleteReview);

module.exports = router;
