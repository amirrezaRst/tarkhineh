const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon, applyCoupon, validateCoupon } = require('../controllers/couponController'); // مسیر به کنترلر مربوطه
const { createCouponValidation } = require('../validation/couponValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');


router.route("/")
    .post(Authenticate, Authorize([ROLES.ADMIN]), createCouponValidation, createCoupon);

router.get("/all-coupons", Authenticate, Authorize([ROLES.ADMIN]), getAllCoupons);

router.route("/:code")
    .get(getCouponByCode)
    .put(Authenticate, Authorize([ROLES.ADMIN]), updateCoupon)
    .delete(Authenticate, Authorize([ROLES.ADMIN]), deleteCoupon);

router.patch("/apply-coupon/:code", Authenticate, applyCoupon);
router.post("/validate-coupon", Authenticate, validateCoupon);

module.exports = router;
