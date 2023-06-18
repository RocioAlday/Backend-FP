const { Router }= require('express');

const userRouter= require('./user');
const modelRouter= require('./model');
const cartRouter= require('./cart');

const router= Router();

router.use('/user', userRouter);
router.use('/model', modelRouter);
router.use('/cart', cartRouter);



module.exports= router;