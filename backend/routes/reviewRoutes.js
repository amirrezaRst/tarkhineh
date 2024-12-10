const express = require('express');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const { createReview, getReview, getAllReviews, updateReview, deleteReview } = require('../controller/reviewController');
const { createReviewValidation, updateReviewValidation } = require('../validation/reviewValidation');

const router = express.Router();

router.route("/")
    .post(createReviewValidation, createReview);

router.get("/allReviews/:id", getAllReviews)

router
    .route('/:id')
    .get(ValidateObjectId, getReview)
    .put(ValidateObjectId, updateReviewValidation, updateReview)
    .delete(ValidateObjectId, deleteReview);

module.exports = router;