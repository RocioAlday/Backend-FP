const Router= require('express');

const { newUser, loginUser }= require('../handlers/user.handlers');

const router= Router();

//POST DE USER:
router.post("/register", newUser);
router.post("/login", loginUser);



module.exports= router;