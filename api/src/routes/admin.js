const Router= require('express');

const { modifyModel }= require('../handlers/model.handlers');

const router= Router();


router.post("/modifyModel", modifyModel);


module.exports= router;