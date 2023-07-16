const Router= require('express');

const { newSTLModel, companyModels, modelsByName, getDolar } = require('../handlers/model.handlers');
const { authMiddleware } = require('../middlewares/authToken');

const router= Router();


router.post("/create", newSTLModel);
router.get("/companyModels", authMiddleware, companyModels);
router.get("/modelByName", authMiddleware, modelsByName);
router.get("/dolarValue",  getDolar);

module.exports= router;