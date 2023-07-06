const Router= require('express');

const { modifyModel, allModels, createModelsDB }= require('../handlers/model.handlers');
const { changeStatusOrderDetail, getOrders, getOrdersForBilling }= require('../handlers/order.handlers');

const router= Router();


router.post("/modifyModel", modifyModel);
router.get("/allModels", allModels);
router.put("/modifyStatusOrderDetail",changeStatusOrderDetail);
router.get("/allOrders", getOrders)
router.post("/createModelsDb", createModelsDB);
router.get("/ordersForBilling", getOrdersForBilling)

module.exports= router;