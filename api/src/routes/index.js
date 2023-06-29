const { Router }= require('express');

const userRouter= require('./user');
const modelRouter= require('./model');
const cartRouter= require('./cart');
const orderRouter= require('./order');

const router= Router();

router.use('/user', userRouter);
router.use('/model', modelRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);


module.exports= router;