const Router= require('express');

const { createOrder, modifyOrder, deleteItemOrder, changeStatus, getOrders, getOrdersByUser, addToOrderConfirmed, deleteOrder, changeConfirmedStatusOrder  } = require('../handlers/order.handlers');
const { authMiddleware } = require('../middlewares/authToken');

const router= Router();


router.post("/newOrder", authMiddleware, createOrder);
router.put("/modifyOrder", authMiddleware, modifyOrder);
router.delete("/deleteItem", authMiddleware, deleteItemOrder);
router.put("/deleteOrder", authMiddleware, deleteOrder)
router.post("/changeStatus", authMiddleware, changeStatus);
router.post("/orderConfirmed", authMiddleware, addToOrderConfirmed)
router.get("/openOrders", authMiddleware, getOrdersByUser);
router.post("/changeConfirmOrderStatus", authMiddleware, changeConfirmedStatusOrder);

module.exports= router;