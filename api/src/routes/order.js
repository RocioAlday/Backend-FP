const Router= require('express');

const { createOrder, modifyOrder  } = require('../handlers/order.handlers');

const router= Router();


router.post("/newOrder", createOrder);
router.put("/modifyOrder", modifyOrder);

module.exports= router;