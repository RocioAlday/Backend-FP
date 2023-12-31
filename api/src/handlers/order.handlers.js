const { newOrder, deleteInOrder, changeOrderStatus, getOrderDetail, changeStatusOD, ordersForBilling, ordersByUser, confirmedOrder, deleteOrderCtrl,
    changeStatusOrderConfirmed, modifyOrderDashAdmin, changePriority, postDataForBudgetOrder, sendBudgetEmail } = require("../controllers/order.controller");


const createOrder= async(req, res)=> {
    const { id }= req.user;
    try{
        const order= await newOrder(id);
        res.status(200).json(order);

    } catch(error){
        res.status(400).json({error: 'Error creating order', message: error.message})
    }
   
};


const modifyOrder= async(req, res)=>{
    const { id }= req.user;  
    try{
        const order= await newOrder(id)
        res.status(200).json(order);

    } catch(error){
        res.status(400).json({error: 'Error geting order', message: error.message})
    }
}


const deleteItemOrder= async(req, res)=> {
    const { id }= req.user;  
    try{
        const newOrder= await deleteInOrder(id);
        res.status(200).json(newOrder);

    } catch(error){
        res.status(400).json({error: 'Error geting order', message: error.message})
    }
}

const changeStatus= async(req, res)=> {
    let {status}= req.body;
    const { id }= req.user;

    try{
        const orderStatus= await changeOrderStatus(id, status);
        res.status(200).json(orderStatus);

    } catch(error){
        res.status(400).json({error: 'Error changing order status', message: error.message})
    }
}

const changeConfirmedStatusOrder= async(req, res)=> {
    const orders= req.body; 
    // console.log(orders);
    try {
        const orderChanged= await changeStatusOrderConfirmed(orders);
        res.status(200).json(orderChanged);

    } catch(error){
        res.status(400).json({error: 'Error changing confirmed order status', message: error.message})
    }

}

const addToOrderConfirmed= async(req, res)=> {
    const { id }= req.user;
    let {orderId, status, dolarValue, observations}= req.body;

    try{
        const order= await confirmedOrder(id, orderId, status, dolarValue, observations);
        res.status(200).json(order);
    } catch(error){
        res.status(400).json({error: 'Error adding order to Orders Confirmed', message: error.message})
    }
}

const deleteOrder= async(req, res)=> {
    const { id }= req.user;
    let {orderId}= req.body;
   
    try{
        await deleteOrderCtrl(id, orderId);
        res.status(200).json({message: 'Order successfully elimated'});

    } catch(error){
        res.status(500).json({error: 'Error deleting order', message: error.message})
    }
}

const getOrders= async(req, res)=> {
    try{
        const detailOrder= await getOrderDetail();
        res.status(200).json(detailOrder)
    } catch(error){
        res.status(500).json({error: 'Error geting all orders', message: error.message})
    }
}

const getOrdersByUser= async(req, res)=> {
    const { id }= req.user;
    try{
        const orders= await ordersByUser(id);
        res.status(200).json(orders);
    } catch(error) {
        res.status(500).json({error: 'Error geting Orders By User', message: error.message})
    }
}

const changeStatusOrderDetail= async (req, res)=> {
    let { status, orderId, modelId }= req.body;
    console.log(status, `OID: ${orderId}`, `ModelID: ${modelId}`);
    try{
        const changeStatus= await changeStatusOD(status, orderId, modelId);
        res.status(200).json(changeStatus)
    } catch(error){
        res.status(500).json({error: 'Error changing status in OrderDetail', message: error.message})
    }
}

const getOrdersForBilling= async(req, res)=> {
    try {
        const orders= await ordersForBilling();
        res.status(200).json(orders);
    } catch(error){
        res.status(500).json({error: 'Error getting orders for billing', message: error.message})
    }
}

const modifyOrderByAdmin= async(req, res)=> {
    const { orderId, modelId, status, quantity, material, color }= req.body;
    console.log(orderId, modelId, status, quantity, material, color);
    try {
        const modified= await modifyOrderDashAdmin(orderId, modelId, status, quantity, material, color);
        res.status(200).json(modified)
    } catch(error) {
        res.status(500).json({error: 'Error modifing order on dashboard admin', message: error.message})
    }
}

const modifyPriority= async(req, res)=> {
    const { orderId, modelId, priority }= req.body;
    try {
        const modify= await changePriority(orderId, modelId, priority);
        res.status(200).json(modify)
    } catch(error) {
        res.status(500).json({error: 'Error modifyng priority in order', message: error.message})
    }
}

const dataForBudget= async(req, res)=> {
    const { id }= req.user;
    const { orderId, dolarValue, observations }= req.body;
    console.log(observations)
    try {
        const result= await postDataForBudgetOrder(id, orderId, dolarValue, observations);
        res.status(200).json(result)
    } catch(error) {
        res.status(500).json({error: 'Error geting data for budget', message: error.message})
    }
}

const sendPDFByEmail= async(req, res)=> {
    const { id }= req.user;
    const pdf= req.body;  
    try {
        await sendBudgetEmail(id, pdf);
        res.send("Email successfully sent.");

    } catch (error) {
        res.status(500).json({error: 'Error sending budget by email', message: error.message})
    }
}

module.exports= {createOrder, modifyOrder, deleteItemOrder, changeStatus, getOrders, changeStatusOrderDetail, getOrdersForBilling, 
    getOrdersByUser, addToOrderConfirmed, deleteOrder, changeConfirmedStatusOrder, modifyOrderByAdmin, modifyPriority, dataForBudget, sendPDFByEmail }