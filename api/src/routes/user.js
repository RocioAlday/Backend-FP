const Router= require('express');

const { newUser, loginUser, logoutUser }= require('../handlers/user.handlers');

const router= Router();

//POST DE USER:
router.post("/register", newUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);


module.exports= router;