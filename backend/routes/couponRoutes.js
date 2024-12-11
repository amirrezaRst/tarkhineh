const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon } = require('../controllers/couponController'); // مسیر به کنترلر مربوطه
const { createCouponValidation } = require('../validation/couponValidation');


router.route("/")
    .post(createCouponValidation, createCoupon);

router.get("/all-coupons", getAllCoupons);

router.route("/:code")
    .get(getCouponByCode)
    .put(updateCoupon)
    .delete(deleteCoupon);

// router.route("/:id")
//     .get()

// // روت ایجاد کوپن
// router.post('/coupons', couponController.createCoupon);

// // روت دریافت تمام کوپن‌ها
// router.get('/coupons', couponController.getAllCoupons);

// // روت دریافت یک کوپن خاص با کد
// router.get('/coupons/:code', couponController.getCouponByCode);

// // روت بروزرسانی یک کوپن
// router.put('/coupons/:code', couponController.updateCoupon);

// // روت حذف یک کوپن
// router.delete('/coupons/:code', couponController.deleteCoupon);

module.exports = router;
