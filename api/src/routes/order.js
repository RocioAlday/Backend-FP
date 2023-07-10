const Router= require('express');

const { createOrder, modifyOrder, deleteItemOrder, changeStatus, getOrders, getOrdersByUser, addToOrderConfirmed, deleteOrder  } = require('../handlers/order.handlers');

const router= Router();


router.post("/newOrder", createOrder);
router.put("/modifyOrder", modifyOrder);
router.delete("/deleteItem", deleteItemOrder);
router.put("/deleteOrder", deleteOrder)
router.post("/changeStatus", changeStatus);
router.post("/orderConfirmed", addToOrderConfirmed)
router.get("/openOrders", getOrdersByUser);

module.exports= router;