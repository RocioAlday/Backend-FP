const Router= require('express');

const { newSTLModel, allModels, companyModels, createModelsDB, modelsByName } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);
router.get("/allModels", allModels);
router.get("/companyModels", companyModels);
router.post("/createModelsDb", createModelsDB);
router.get("/modelByName", modelsByName);

module.exports= router;