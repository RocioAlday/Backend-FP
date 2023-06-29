const Router= require('express');

const { createOrder, modifyOrder, deleteItemOrder  } = require('../handlers/order.handlers');

const router= Router();


router.post("/newOrder", createOrder);
router.put("/modifyOrder", modifyOrder);
router.delete("/deleteItem", deleteItemOrder)

module.exports= router;