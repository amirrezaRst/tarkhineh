const express = require('express');
const router = express.Router();
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch, getMainCategoryItems, getTopRatedItems, getBranchItems } = require('../controllers/branchController');
const { createBranchValidation, updateBranchValidation } = require('../validation/branchValidation');


router.route("/")
    .get(getAllBranches)
    .post(createBranchValidation, createBranch);

router.get("/get-branch-items/:id", getBranchItems);

router.route("/:id")
    .get(getBranchById)
    .put(updateBranchValidation, updateBranch)
    .delete(deleteBranch);


module.exports = router;
