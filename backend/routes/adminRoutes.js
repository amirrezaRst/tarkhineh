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
} = require('../controllers/adminController');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');
const uploadImage = require('../utils/upload');

const router = express.Router();
const adminOnly = [Authenticate, Authorize([ROLES.ADMIN])];
const branchPhotos = uploadImage({ fieldName: "images", fileSize: 5000000, destination: '../public/branch-images/', width: 1000, height: 700, quality: 78, maxCount: 6 });

router.get("/overview", adminOnly, getOverview);
router.get("/search", adminOnly, getSearch);
router.get("/reports", adminOnly, getReports);
router.get("/customers", adminOnly, getCustomers);
router.get("/activity", adminOnly, getActivity);
router.get("/settings", adminOnly, getSettings);
router.patch("/settings", adminOnly, updateSettings);

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
router.get("/finance", adminOnly, getFinance);
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
