const Like = require("../models/LikeModel");
const Menu = require('../models/MenuModel');


//! Get Request
//? Get MenuItem Like Status
exports.likeStatus = async (req, res) => {
    const { user, menuItem } = req.params;
    try {
        const like = await Like.findOne({ user, menuItem }).select("user menuItem");
        res.status(200).json({ status: 200, liked: !!like });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, error, message: 'Failed to get like status' });
    }
};

//? Get Likes List of Specific MenuItem
exports.getLikes = async (req, res) => {
    const { menuItem } = req.params;
    try {
        const likes = await Like.find({ menuItem }).select("_id");
        res.status(200).json({ status: 200, total: likes.length });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, error, message: 'Failed to get likes' });
    }
};



//! Post Request
//? Liked Menu Item
exports.like = async (req, res) => {
    const { user, menuItem } = req.body;
    try {
        const existingLike = await Like.findOne({ user, menuItem }).select("_id");
        if (existingLike) {
            // return res.status(400).json({ status: 400, message: 'You have already liked this menuItem' });
            const like = await Like.findOneAndDelete({ user, menuItem });
            return res.status(200).json({ status: 200, message: "unliked successfully" })
        }

        const menu = await Menu.findById(menuItem).select("_id");
        if (!menu) return res.status(400).json({ status: 400, message: "the item with this ID does not exist" })

        const like = new Like({ user, menuItem });
        await like.save();

        res.status(201).json({ status: 201, message: 'Liked successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, error, message: "failed to like" });
    }
};

//? unliked Menu Item
exports.unlike = async (req, res) => {
    const { user, menuItem } = req.body;
    try {
        const like = await Like.findOneAndDelete({ user, menuItem });
        if (!like) {
            return res.status(404).json({ status: 404, message: 'Like not found' });
        }
        res.status(200).json({ status: 200, message: 'Unliked successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, error, message: "failed to unlike" });
    }
};
