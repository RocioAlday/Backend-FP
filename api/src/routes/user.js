const Router= require('express');

const { newUser }= require('../handlers/user.handlers');

const router= Router();

//POST DE USER:
router.post("/register", newUser);




module.exports= router;