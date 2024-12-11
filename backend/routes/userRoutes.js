const { Router } = require('express');

const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { allUser, singleUser, deleteUser, registerUser, login, logout, refreshToken } = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validation/userValidation');
// const { registerValidation, loginValidation, addSubscriptionValidation } = require('../validation/userValidation');

const router = Router();



router.get("/users", allUser); //[Authenticate, Aut horize(["admin"])],

router.get("/userData", singleUser);
router.route("/user/:id")
    .delete(ValidateObjectId, deleteUser); //[Authenticate, Authorize(["admin"])],
//! must add edit user route here

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, login);
router.post('/logout', logout);
router.get("/refreshToken", refreshToken);


module.exports = router;