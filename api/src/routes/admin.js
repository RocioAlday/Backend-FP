const Router= require('express');

const { modifyModel, allModels, createModelsDB }= require('../handlers/model.handlers');
const { changeStatusOrderDetail, getOrders, getOrdersForBilling, modifyOrderByAdmin, modifyPriority }= require('../handlers/order.handlers');

const router= Router();


router.put("/modifyModel", modifyModel);   //agregar control de token role para admin en todas estas rutas , separar las que son del OPERARIO y lAS del ADMIN 
router.get("/allModels", allModels);
router.put("/modifyStatusOrderDetail",changeStatusOrderDetail);
router.get("/allOrders", getOrders)
router.post("/createModelsDb", createModelsDB);
router.get("/ordersForBilling", getOrdersForBilling);
router.put("/modifyOrderDetail", modifyOrderByAdmin);
router.put("/modifyPriority", modifyPriority)

module.exports= router;