const Branch = require('../model/BranchModel');
const UserModel = require('../model/UserModel');


//! Get Request
//? Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find().populate('manager', 'fullName email');
        res.status(200).json({ status: 200, message: "fetch data successfully", branches });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching branches.", error: error.message });
    }
};

//? Get a single branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id).populate('manager', 'fullName email');
        if (!branch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }
        res.status(200).json({ status: 200, message: "fetch data successfully", branch });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching branch.", error: error.message });
    }
};


//! Post Request
//? Create a new branch
exports.createBranch = async (req, res) => {
    try {
        const { manager, menus } = req.body;

        const user = await UserModel.findById(manager).select("role");
        if (!user) return res.status(400).json({ status: 400, message: "no manager was found with this ID" });

        if (user.role !== "branch_manager") return res.status(400).json({ status: 400, message: "The user's role must be branch_manager" })

        const branch = new Branch({
            manager,
            menus,
        });

        const savedBranch = await branch.save();
        res.status(201).json({ status: 201, message: "Branch created successfully.", branch: savedBranch });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error creating branch.", error: error.message });
    }
};


//! Put Request
//? Update a branch
exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { manager, menus } = req.body;

        const updatedBranch = await Branch.findByIdAndUpdate(id, { manager, menus }, { new: true });
        if (!updatedBranch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }
        res.status(200).json({ status: 200, message: "Branch updated successfully.", branch: updatedBranch });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error updating branch.", error: error.message });
    }
};

//! Delete Request
//? Delete Branch By ID
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBranch = await Branch.findByIdAndDelete(id);
        if (!deletedBranch) {
            return res.status(404).json({ status: 404, message: "Branch not found." });
        }
        res.status(200).json({ status: 200, message: "Branch deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error deleting branch.", error: error.message });
    }
};
