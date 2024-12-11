const express = require('express');
const router = express.Router();
const { getDiscounts, createDiscount, getDiscountById, updateDiscount, deleteDiscount } = require('../controllers/discountController');
const { createDiscountValidation } = require('../validation/discountValidation');


router.route("/")
    .get(getDiscounts)
    .post(createDiscountValidation, createDiscount);

router.route("/:id")
    .get(getDiscountById)
    .put(createDiscountValidation, updateDiscount)
    .delete(deleteDiscount)


module.exports = router;
