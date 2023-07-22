const Router= require('express');

const { newUser, loginUser, logoutUser, allUsers, getUserInfoForBilling, getUserData }= require('../handlers/user.handlers');
const { authMiddleware } = require('../middlewares/authToken');

const router= Router();

//POST DE USER:
router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/allUsers", allUsers);
router.get("/dataUserForBill", authMiddleware, getUserInfoForBilling)
router.get("/userData", authMiddleware, getUserData)

module.exports= router;