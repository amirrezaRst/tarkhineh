const express = require('express');

const {
    getOverview, getSearch, getBranches, createBranch, updateBranch, assignManager, deleteBranch,
    getUsers, updateUserRole, deleteUser, getAssignableUsers, getReports,
    getOrders, cancelOrder, getCouriers, getFinance, refundOrder,
    getCustomers, getActivity, getSettings, updateSettings,
    getBranchDetail, setBranchImages,
    getCoupons, createCoupon, updateCoupon, deleteCoupon,
    getDiscounts, createDiscount, updateDiscount, deleteDiscount,
    getReviews, updateReviewStatus, deleteReview,
    getSlides, createSlide, updateSlide, deleteSlide, reorderSlides,
} = require('../controllers/adminController');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');
const uploadImage = require('../utils/upload');
const cache = require('../middleware/cacheMiddleware');
const { adminOverviewKey, adminReportsKey, adminFinanceKey, adminActivityKey } = require('../utils/cacheKeys');

const router = express.Router();
const adminOnly = [Authenticate, Authorize([ROLES.ADMIN])];
const branchPhotos = uploadImage({ fieldName: "images", fileSize: 5000000, destination: '../public/branch-images/', width: 1000, height: 700, quality: 78, maxCount: 6 });
const slidePhoto = uploadImage({ fieldName: "images", fileSize: 5000000, destination: '../public/slide-images/', width: 1600, height: 600, quality: 80, maxCount: 1 });

// Short TTLs, no invalidation (see cacheKeys.js) — these are cross-collection
// aggregates with "live-ish" figures (today's order status, the activity
// feed), so the cache window is kept small enough that new activity shows up
// promptly rather than exactly-invalidated.
router.get("/overview", adminOnly, cache(30, adminOverviewKey), getOverview);
router.get("/search", adminOnly, getSearch);
router.get("/reports", adminOnly, cache(45, (req) => adminReportsKey(req.query.period || "month")), getReports);
router.get("/customers", adminOnly, getCustomers);
router.get("/activity", adminOnly, cache(15, adminActivityKey), getActivity);
router.get("/settings", adminOnly, getSettings);
router.patch("/settings", adminOnly, updateSettings);

router.get("/slides", adminOnly, getSlides);
router.post("/slides", adminOnly, ...slidePhoto, createSlide);
router.patch("/slides/reorder", adminOnly, reorderSlides);
router.patch("/slides/:id", adminOnly, ...slidePhoto, updateSlide);
router.delete("/slides/:id", adminOnly, deleteSlide);

router.get("/branches", adminOnly, getBranches);
router.get("/branches/:id", adminOnly, getBranchDetail);
router.post("/branches", adminOnly, createBranch);
router.patch("/branches/:id", adminOnly, updateBranch);
router.patch("/branches/:id/images", adminOnly, ...branchPhotos, setBranchImages);
router.patch("/branches/:id/assign-manager", adminOnly, assignManager);
router.delete("/branches/:id", adminOnly, deleteBranch);

router.get("/orders", adminOnly, getOrders);
router.patch("/orders/:id/cancel", adminOnly, cancelOrder);
router.get("/couriers", adminOnly, getCouriers);
router.get("/finance", adminOnly, cache(45, (req) => adminFinanceKey(req.query.period || "month")), getFinance);
router.patch("/orders/:id/refund", adminOnly, refundOrder);

router.get("/coupons", adminOnly, getCoupons);
router.post("/coupons", adminOnly, createCoupon);
router.patch("/coupons/:id", adminOnly, updateCoupon);
router.delete("/coupons/:id", adminOnly, deleteCoupon);

router.get("/discounts", adminOnly, getDiscounts);
router.post("/discounts", adminOnly, createDiscount);
router.patch("/discounts/:id", adminOnly, updateDiscount);
router.delete("/discounts/:id", adminOnly, deleteDiscount);

router.get("/reviews", adminOnly, getReviews);
router.patch("/reviews/:id/status", adminOnly, updateReviewStatus);
router.delete("/reviews/:id", adminOnly, deleteReview);

router.get("/users", adminOnly, getUsers);
router.get("/assignable-users", adminOnly, getAssignableUsers);
router.patch("/users/:id/role", adminOnly, updateUserRole);
router.delete("/users/:id", adminOnly, deleteUser);

module.exports = router;
