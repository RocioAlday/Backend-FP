const Router= require('express');

const { newSTLModel, allModels, companyModels } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);
router.get("/allModels", allModels);
router.get("/companyModels", companyModels);


module.exports= router;