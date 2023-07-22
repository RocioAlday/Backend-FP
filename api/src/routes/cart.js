const Router= require('express');

const { getCart, modifyCart, deleteCart } = require('../handlers/cart.handlers');
const { authMiddleware } = require('../middlewares/authToken');

const router= Router();


router.get("/cartByUser", authMiddleware, getCart);
router.put("/modifyCart", authMiddleware, modifyCart);
router.get("/deleteCart", authMiddleware, deleteCart);

module.exports= router;