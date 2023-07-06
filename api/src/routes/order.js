const Router= require('express');

const { createOrder, modifyOrder, deleteItemOrder, changeStatus, getOrders  } = require('../handlers/order.handlers');

const router= Router();


router.post("/newOrder", createOrder);
router.put("/modifyOrder", modifyOrder);
router.delete("/deleteItem", deleteItemOrder);
router.post("/changeStatus", changeStatus);

module.exports= router;