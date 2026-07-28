const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
const User = require('../models/UserModel');
const { ROLES } = require('../config/roles');

exports.getAllReviews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 4, 20); // cap the page size
    const skip = (page - 1) * limit;

    try {
        // Only approved reviews are shown publicly (moderation gate).
        const query = { menuItem: req.params.id, status: "approved" };
        const [reviews, total, spread] = await Promise.all([
            Review.find(query)
                .populate("user", "fullName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments(query),
            // Rating spread over EVERY approved review, not just this page —
            // deriving it from the loaded page would misreport the breakdown
            // as the reader pages through.
            Review.aggregate([
                { $match: { menuItem: new mongoose.Types.ObjectId(req.params.id), status: "approved" } },
                { $group: { _id: "$rating", count: { $sum: 1 } } },
            ]),
        ]);

        const distribution = [0, 0, 0, 0, 0]; // index 0 = 1 star
        spread.forEach((s) => { if (s._id >= 1 && s._id <= 5) distribution[s._id - 1] = s.count; });

        res.status(200).json({
            status: 200,
            message: "fetch review data successfully",
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
            distribution,
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