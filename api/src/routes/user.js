const Router= require('express');

const { newUser, loginUser, logoutUser, allUsers, getUserInfoForBilling }= require('../handlers/user.handlers');

const router= Router();

//POST DE USER:
router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/allUsers", allUsers);
router.get("/dataUserForBill", getUserInfoForBilling)


module.exports= router;