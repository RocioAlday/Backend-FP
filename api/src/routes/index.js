const { Router }= require('express');

const userRouter= require('./user');
const modelRouter= require('./model');

const router= Router();

router.use('/user', userRouter);
router.use('/model', modelRouter);




module.exports= router;