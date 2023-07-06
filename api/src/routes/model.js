const Router= require('express');

const { newSTLModel, allModels, companyModels, createModelsDB, modelsByName, modifyModel } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);
router.get("/companyModels", companyModels);
router.get("/modelByName", modelsByName);

module.exports= router;