const Router= require('express');

const { newSTLModel, companyModels, modelsByName, getDolar } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);
router.get("/companyModels", companyModels);
router.get("/modelByName", modelsByName);
router.get("/dolarValue",  getDolar);

module.exports= router;