const { Router } = require('express');

const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { allUser, singleUser, deleteUser, registerUser, login, logout, refreshToken, verifyOtp, newAddress, deleteAddress, editAddress, editUser } = require('../controllers/userController');
const { registerValidation, loginValidation, verifyOtpValidation, newAddressValidation, editAddressValidation, editUserValidation } = require('../validation/userValidation');

const router = Router();



router.get("/users", allUser); //[Authenticate, Authorize(["admin"])],
router.get("/userData", singleUser);

router.route("/user/:id")
    .delete(ValidateObjectId, deleteUser); //[Authenticate, Authorize(["admin"])],
//! must add edit user route here

router.post("/register", registerValidation, registerUser);
router.post("/verifyOtp", verifyOtpValidation, verifyOtp);
router.post("/login", loginValidation, login);
router.delete('/logout', logout);
router.get("/refreshToken", refreshToken);
router.patch("/editUser/:id", [ValidateObjectId, editUserValidation], editUser);

//? Address Endpoints
router.post("/newAddress/:id", [ValidateObjectId, newAddressValidation], newAddress);
router.delete("/deleteAddress/:id/:address", [ValidateObjectId], deleteAddress);
router.put("/editAddress/:id/:address", [ValidateObjectId, editAddressValidation], editAddress)




module.exports = router;