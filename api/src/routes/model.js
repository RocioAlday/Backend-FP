const Router= require('express');

const { newSTLModel, allModels, companyModels, createModelsDB } = require('../handlers/model.handlers');

const router= Router();


router.post("/create", newSTLModel);
router.get("/allModels", allModels);
router.get("/companyModels", companyModels);
router.post("/createModelsDb", createModelsDB);

module.exports= router;