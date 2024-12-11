const express = require('express');
const router = express.Router();
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch } = require('../controllers/branchController');
const { createBranchValidation, updateBranchValidation } = require('../validation/BranchValidation');


router.route("/")
    .get(getAllBranches)
    .post(createBranchValidation, createBranch);

router.route("/:id")
    .get(getBranchById)
    .put(updateBranchValidation, updateBranch)
    .delete(deleteBranch);


module.exports = router;
