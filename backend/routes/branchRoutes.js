const express = require('express');
const router = express.Router();
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch, getMainCategoryItems, getTopRatedItems, getBranchItems, getBranchReviews } = require('../controllers/branchController');
const { createBranchValidation, updateBranchValidation } = require('../validation/BranchValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');
const cache = require('../middleware/cacheMiddleware');
const { branchesAllKey, branchByIdKey, branchItemsKey } = require('../utils/cacheKeys');


router.route("/")
    .get(cache(120, branchesAllKey), getAllBranches)
    .post(Authenticate, Authorize([ROLES.ADMIN]), createBranchValidation, createBranch);

// Free-text search isn't cached (see branchItemsKey) — too many distinct
// values for a worthwhile hit rate, so it always bypasses to a live query.
router.get(
    "/get-branch-items/:id",
    cache(60, (req) => branchItemsKey(req.params.id, req.query), { skip: (req) => Boolean(req.query.search) }),
    getBranchItems
);
router.get("/:id/reviews", getBranchReviews);

router.route("/:id")
    .get(cache(120, (req) => branchByIdKey(req.params.id)), getBranchById)
    .put(Authenticate, Authorize([ROLES.ADMIN]), updateBranchValidation, updateBranch)
    .delete(Authenticate, Authorize([ROLES.ADMIN]), deleteBranch);


module.exports = router;
