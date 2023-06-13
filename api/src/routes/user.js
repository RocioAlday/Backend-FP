const Router= require('express');

const { newUser, loginUser, logoutUser, allUsers }= require('../handlers/user.handlers');

const router= Router();

//POST DE USER:
router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/allUsers", allUsers);


module.exports= router;