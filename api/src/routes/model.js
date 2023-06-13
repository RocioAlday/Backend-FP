const Router= require('express');

const { newSTLModel } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);



module.exports= router;