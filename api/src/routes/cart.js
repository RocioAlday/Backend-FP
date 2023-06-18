const Router= require('express');

const { getCart, modifyCart } = require('../handlers/cart.handlers');

const router= Router();


router.get("/cartByUser", getCart);
router.put("/modifyCart", modifyCart)

module.exports= router;