const express = require('express');
const router = express.Router();
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch, getMainCategoryItems, getTopRatedItems, getBranchItems, getBranchReviews } = require('../controllers/branchController');
const { createBranchValidation, updateBranchValidation } = require('../validation/BranchValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');


router.route("/")
    .get(getAllBranches)
    .post(Authenticate, Authorize([ROLES.ADMIN]), createBranchValidation, createBranch);

router.get("/get-branch-items/:id", getBranchItems);
router.get("/:id/reviews", getBranchReviews);

router.route("/:id")
    .get(getBranchById)
    .put(Authenticate, Authorize([ROLES.ADMIN]), updateBranchValidation, updateBranch)
    .delete(Authenticate, Authorize([ROLES.ADMIN]), deleteBranch);


module.exports = router;
