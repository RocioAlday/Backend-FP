const { newOrder, deleteInOrder, changeOrderStatus } = require("../controllers/order.controller");

const createOrder= async(req, res)=> {
    let token= req.headers.authorization;
    console.log(token);
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token= req.headers.authorization.split(" ")[1] 
        console.log(token);
        try{
            const order= await newOrder(token);
            res.status(200).json(order);

        } catch(error){
        res.status(500).json({error: 'Error creating order', message: error.message})
        }
    } else {
        res.status(500).send('There is no token attached to header');
    }
};



const modifyOrder= async(req, res)=>{
    let token= req.headers.authorization;
    console.log(token);
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token= req.headers.authorization.split(" ")[1] 
        
        try{
            const order= await newOrder(token)
            res.status(200).json(order);

        } catch(error){
        res.status(500).json({error: 'Error geting order', message: error.message})
        }
    } else {
        res.status(500).send('There is no token attached to header');
    }

}


const deleteItemOrder= async(req, res)=> {
    let token= req.headers.authorization;

    if(req?.headers?.authorization?.startsWith('Bearer')){
        token= req.headers.authorization.split(" ")[1] 
        
        try{
            const newOrder= await deleteInOrder(token);
            res.status(200).json(newOrder);

        } catch(error){
        res.status(500).json({error: 'Error geting order', message: error.message})
        }
    } else {
        res.status(500).send('There is no token attached to header');
    }

}

const changeStatus= async(req, res)=> {
    let token= req.headers.authorization;
    let {status}= req.body;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token= req.headers.authorization.split(" ")[1] 
        
        try{
            const orderStatus= await changeOrderStatus(token, status);
            res.status(200).json(orderStatus);

        } catch(error){
        res.status(500).json({error: 'Error changing order status', message: error.message})
        }
    } else {
        res.status(500).send('There is no token attached to header');
    }
}


module.exports= {createOrder, modifyOrder, deleteItemOrder, changeStatus}