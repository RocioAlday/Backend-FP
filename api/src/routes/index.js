const { Router }= require('express');

const userRouter= require('./user');
const modelRouter= require('./model');
const cartRouter= require('./cart');
const orderRouter= require('./order');
const adminRouter= require('./admin');

const router= Router();

router.use('/user', userRouter);
router.use('/model', modelRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/admin', adminRouter);


module.exports= router;