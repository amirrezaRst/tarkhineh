const Branch = require('../models/BranchModel');
const UserModel = require('../models/UserModel');
const Discount = require('../models/DiscountModel');
const Review = require('../models/ReviewModel');


// Current open/closed state from "HH:MM" hours (Asia/Tehran); null if unset.
const isBranchOpen = (openTime, closeTime) => {
    if (!openTime || !closeTime) return null;
    const now = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Tehran", hour12: false, hour: "2-digit", minute: "2-digit" });
    const m = (s) => { const [h, mm] = s.split(":").map(Number); return h * 60 + mm; };
    const o = m(openTime), c = m(closeTime), n = m(now);
    return c > o ? (n >= o && n < c) : (n >= o || n < c);
};

//! Get Request
//? Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find().populate('manager', 'fullName email').lean();
        const withState = branches.map((b) => ({ ...b, isOpen: isBranchOpen(b.openTime, b.closeTime) }));
        res.status(200).json({ status: 200, message: "fetch data successfully", branches: withState });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching branches.", error: error.message });
    }
};

//? Get a single branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await Branch.findById(id)
            .populate('manager', 'fullName email')
            .populate({
                path: 'menus',
                select: 'name price category images available foodType isPersian'
            });

        if (!branch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }


        const menusWithDetails = await Promise.all(
            branch.menus.map(async (menu) => {

                //! finding the discount for each menu item
                const discount = await Discount.findOne({
                    menuItem: menu._id,
                    active: true,
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                }).select("discountType discountValue");

                //! Finding the number of reviews and the average rating for each menu item.
                //! Only approved ones — the public review list is moderation-gated the
                //! same way, so an unmoderated review must not inflate the count/rating.
                const reviews = await Review.find({ menuItem: menu._id, status: "approved" });
                const totalReviews = reviews.length;
                const averageRating = totalReviews
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
                    : null;

                return {
                    ...menu._doc, //! Copy Menu info
                    discount: discount || null, //! adding discount to the response
                    reviews: {
                        total: totalReviews, //! number of reviews
                        averageRating: averageRating //! average rating
                    }
                };
            })
        );

        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            branch: {
                _id: branch._id,
                name: branch.name,
                manager: branch.manager,
                address: branch.address,
                phoneNumber: branch.phoneNumber,
                openTime: branch.openTime,
                closeTime: branch.closeTime,
                images: branch.images,
                isOpen: isBranchOpen(branch.openTime, branch.closeTime),
                menus: menusWithDetails
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching branch.", error: error.message });
    }
};


exports.getBranchItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit, category, sortBy, foodType, isPersian, search } = req.query;

        const branch = await Branch.findById(id)
            .populate('manager', 'fullName email')
            .populate({
                path: 'menus',
                match: {
                    ...(category && { category }),
                    ...(foodType && { foodType }),
                    ...(isPersian && { isPersian: isPersian === 'true' }),
                    ...(search && { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } })
                },
                select: 'name price category images ingredients description available foodType isPersian createdAt'
            });

        if (!branch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }

        const menusWithDetails = await Promise.all(
            branch.menus.map(async (menu) => {
                //! finding the discount for each menu item
                const discount = await Discount.findOne({
                    menuItem: menu._id,
                    active: true,
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                }).select("discountType discountValue");

                //! Finding the number of reviews and the average rating for each menu item.
                //! Only approved ones — the public review list is moderation-gated the
                //! same way, so an unmoderated review must not inflate the count/rating.
                const reviews = await Review.find({ menuItem: menu._id, status: "approved" });
                const totalReviews = reviews.length;
                const averageRating = totalReviews
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
                    : null;

                return {
                    ...menu._doc,   //! Copy Menu info
                    discount: discount || null, //! adding discount to the response
                    reviews: {
                        total: totalReviews,    //! number of reviews
                        averageRating: averageRating    //! average rating
                    }
                };
            })
        );

        let sortedMenus = menusWithDetails;

        if (sortBy === "rating") {
            sortedMenus = menusWithDetails.sort((a, b) => b.reviews.averageRating - a.reviews.averageRating);
        }
        else if (sortBy === "asc") {
            sortedMenus = menusWithDetails.sort((a, b) => b.createdAt - a.createdAt);
        }
        else if (sortBy === "desc") {
            sortedMenus = menusWithDetails.sort((a, b) => a.createdAt - b.createdAt);
        }

        res.status(200).json({
            status: 200,
            message: "Fetch items successfully.",
            branch: {
                _id: branch._id,
                name: branch.name,
                manager: branch.manager,
                menus: limit ? sortedMenus.slice(0, parseInt(limit)) : sortedMenus
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching items.", error: error.message });
    }
};






//? Get recent approved reviews for a branch (public "نظرات کاربران" section)
exports.getBranchReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 6;

        const reviews = await Review.find({ branch: id, status: "approved" })
            .populate("user", "fullName")
            .populate("menuItem", "name")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({ status: 200, message: "fetch reviews successfully", reviews });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching reviews.", error: error.message });
    }
};


//! Post Request
//? Create a new branch
exports.createBranch = async (req, res) => {
    try {
        const { manager, menus } = req.body;

        const user = await UserModel.findById(manager).select("role");
        if (!user) return res.status(400).json({ status: 400, message: "no manager was found with this ID" });

        if (user.role !== "branch_manager") return res.status(400).json({ status: 400, message: "The user's role must be branch_manager" })

        const branch = new Branch(req.body);

        const savedBranch = await branch.save();
        res.status(201).json({ status: 201, message: "Branch created successfully.", branch: savedBranch });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error creating branch.", error: error.message });
    }
};


//! Put Request
//? Update a branch
exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { manager, menus } = req.body;

        const updatedBranch = await Branch.findByIdAndUpdate(id, { manager, menus }, { new: true });
        if (!updatedBranch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }
        res.status(200).json({ status: 200, message: "Branch updated successfully.", branch: updatedBranch });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error updating branch.", error: error.message });
    }
};

//! Delete Request
//? Delete Branch By ID
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBranch = await Branch.findByIdAndDelete(id);
        if (!deletedBranch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }
        res.status(200).json({ status: 200, message: "Branch deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error deleting branch.", error: error.message });
    }
};
