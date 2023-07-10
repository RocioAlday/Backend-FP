const Router= require('express');

const { getCart, modifyCart, deleteCart } = require('../handlers/cart.handlers');

const router= Router();


router.get("/cartByUser", getCart);
router.put("/modifyCart", modifyCart);
router.get("/deleteCart", deleteCart);

module.exports= router;