const { Router } = require('express');

const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const AuthorizeOwner = require('../middleware/AuthorizeOwner');
const { otpLimiter } = require('../middleware/rateLimiters');
const { ROLES } = require('../config/roles');
const { allUser, singleUser, deleteUser, registerUser, logout, refreshToken, verifyOtp, newAddress, deleteAddress, editAddress, editUser } = require('../controllers/userController');
const { registerValidation, verifyOtpValidation, newAddressValidation, editAddressValidation, editUserValidation } = require('../validation/userValidation');

const router = Router();



router.get("/users", Authenticate, Authorize([ROLES.ADMIN]), allUser);
router.get("/userData", singleUser);

router.route("/user/:id")
    .delete(Authenticate, Authorize([ROLES.ADMIN]), ValidateObjectId, deleteUser);
//! must add edit user route here

router.post("/register", otpLimiter, registerValidation, registerUser);
router.post("/verifyOtp", otpLimiter, verifyOtpValidation, verifyOtp);
router.delete('/logout', logout);
router.get("/refreshToken", refreshToken);
router.patch("/editUser/:id", Authenticate, AuthorizeOwner('id'), [ValidateObjectId, editUserValidation], editUser);

//? Address Endpoints
router.post("/newAddress/:id", Authenticate, AuthorizeOwner('id'), [ValidateObjectId, newAddressValidation], newAddress);
router.delete("/deleteAddress/:id/:address", Authenticate, AuthorizeOwner('id'), [ValidateObjectId], deleteAddress);
router.put("/editAddress/:id/:address", Authenticate, AuthorizeOwner('id'), [ValidateObjectId, editAddressValidation], editAddress)




module.exports = router;
