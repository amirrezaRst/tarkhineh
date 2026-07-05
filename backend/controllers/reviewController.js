const Review = require('../models/ReviewModel');
const User = require('../models/UserModel');
const { ROLES } = require('../config/roles');

exports.getAllReviews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // Default to 4 reviews per page
    const skip = (page - 1) * limit;

    try {
        const reviews = await Review.find({ menuItem: req.params.id })
            .skip(skip)
            .limit(limit)
        res.status(200).json({
            status: 200,
            message: "fetch review data successfully",
            total: reviews.length,
            reviews
        });
    }
    catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

//! front-end pagination functionality
// const fetchReviews = async (movieId, page = 1, limit = 4) => {
//     const res = await fetch(`/api/reviews?movieId=${movieId}&page=${page}&limit=${limit}`);
//     const data = await res.json();
//     return data;
// };

exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            review
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { text, rating, menuItem, branch } = req.body;
        const newReview = await Review.create({ text, rating, menuItem, branch, user: req.user.id });
        res.status(201).json({
            status: 201,
            message: 'Review created successfully',
            review: newReview
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
};


exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).select("user");
        if (!review) {
            return res.status(404).json({ status: 404, message: 'No review found with that ID' });
        }
        if (review.user.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ status: 403, message: "You do not have access to this review" });
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, { text: req.body.text }, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 200,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).select("user");
        if (!review) {
            return res.status(404).json({
                status: 404,
                message: 'No review found with that ID'
            });
        }
        if (review.user.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ status: 403, message: "You do not have access to this review" });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 200,
            message: 'Review deleted successfully',
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err.message
        });
    }
};