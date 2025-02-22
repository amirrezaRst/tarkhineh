const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon, applyCoupon, validateCoupon } = require('../controllers/couponController'); // مسیر به کنترلر مربوطه
const { createCouponValidation } = require('../validation/couponValidation');


router.route("/")
    .post(createCouponValidation, createCoupon);

router.get("/all-coupons", getAllCoupons);

router.route("/:code")
    .get(getCouponByCode)
    .put(updateCoupon)
    .delete(deleteCoupon);

router.patch("/apply-coupon/:code", applyCoupon);
router.post("/validate-coupon", validateCoupon);

module.exports = router;
