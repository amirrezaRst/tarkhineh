const express = require('express');
const router = express.Router();
const { getDiscounts, createDiscount, getDiscountById, updateDiscount, deleteDiscount } = require('../controllers/discountController');
const { createDiscountValidation } = require('../validation/discountValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');


router.route("/")
    .get(getDiscounts)
    .post(Authenticate, Authorize([ROLES.ADMIN]), createDiscountValidation, createDiscount);

router.route("/:id")
    .get(getDiscountById)
    .put(Authenticate, Authorize([ROLES.ADMIN]), createDiscountValidation, updateDiscount)
    .delete(Authenticate, Authorize([ROLES.ADMIN]), deleteDiscount)


module.exports = router;
