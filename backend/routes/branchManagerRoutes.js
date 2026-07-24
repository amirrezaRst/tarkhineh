const express = require('express');

const {
    getBranchOrders, getBranchMenus, toggleMenuAvailability,
    getBranchCouriers, getBranchStats,
    createCourier, updateCourier, deleteCourier, getCourierDetail, updateCourierCapacity,
} = require('../controllers/branchManagerController');
const Authenticate = require('../middleware/Authenticate');
const AuthorizeBranch = require('../middleware/AuthorizeBranch');
const uploadImage = require('../utils/upload');

const router = express.Router();

// Courier photo upload: single image, 2MB, square, stored in public/courier-images.
const courierPhoto = uploadImage({
    fieldName: "image",
    fileSize: "2000000",
    destination: '../public/courier-images/',
    width: 400,
    height: 400,
    quality: 78,
    maxCount: 1,
});

router.get("/orders/:branch", Authenticate, AuthorizeBranch('branch'), getBranchOrders);
router.get("/menus/:branch", Authenticate, AuthorizeBranch('branch'), getBranchMenus);
router.patch("/menus/:branch/:menuId", Authenticate, AuthorizeBranch('branch'), toggleMenuAvailability);
router.get("/stats/:branch", Authenticate, AuthorizeBranch('branch'), getBranchStats);

// Couriers
router.get("/couriers/:branch", Authenticate, AuthorizeBranch('branch'), getBranchCouriers);
router.post("/couriers/:branch", Authenticate, AuthorizeBranch('branch'), ...courierPhoto, createCourier);
router.get("/couriers/:branch/:courierId", Authenticate, AuthorizeBranch('branch'), getCourierDetail);
router.patch("/couriers/:branch/:courierId", Authenticate, AuthorizeBranch('branch'), ...courierPhoto, updateCourier);
router.delete("/couriers/:branch/:courierId", Authenticate, AuthorizeBranch('branch'), deleteCourier);
router.patch("/settings/:branch/courier-capacity", Authenticate, AuthorizeBranch('branch'), updateCourierCapacity);

module.exports = router;
