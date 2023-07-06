const { User, Cart, Order, Model, OrderDetail }= require('../db');
const jwt= require('jsonwebtoken');

const newOrder= async(token) => {
    if (token){
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const findUser= await User.findByPk(decoded?.id); 
        const cartUser= await Cart.findOne({where: {userId: findUser.id}});
        let order= await Order.findOne({where: {cartId: cartUser.id}})

        if (!cartUser) {
            throw new Error('Cart not found');
        } else if (!cartUser.items.length && order) {
            await order.destroy();
        } else if (!cartUser.items.length) { 
            throw new Error('No Products on Cart') 
        };

        if(!order && cartUser){
            order = await Order.create({
                userId: findUser.id,
                cartId: cartUser.id,
            });
        }
      if(order && cartUser) {
        let cartModels= [];
        for (const item of cartUser.items) {        
            const model= await Model.findByPk(item.id);
            cartModels.push(model);
            const subtotal= item.quantity * model.price;
            await order.addModel(model, {
                through: {quantity: item.quantity, subtotal: subtotal, color: item.color}
            })
        }
        console.log(cartModels);

        let totalPrice= 0;
        const allModelsOrder= await order.getModels(); 
        for (const model of allModelsOrder) {
            totalPrice += model.price * model.OrderDetail.quantity;
        }
        await order.update({totalBudget: totalPrice});

        const orderDetails = await Order.findOne({ 
            where: {id: order.id},
            include: [
              {
                model: Model,
                through: {
                  model: OrderDetail,
                  attributes: ['quantity', 'subtotal', 'color']
                }
              }
            ]
          });

        return orderDetails;
      }
    } else {
        throw new Error('No RefreshToken in cookies');
    }

};


const deleteInOrder= async(token)=> {
    if (token){
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const findUser= await User.findByPk(decoded?.id); 
        const cartUser= await Cart.findOne({where: {userId: findUser.id}});
        let order= await Order.findOne({where: {cartId: cartUser.id}});
        await order.destroy();
        const modifyOrder= await newOrder(token);
        
        return modifyOrder;
    }
}

const changeOrderStatus= async(token, status)=> {
    if (token){
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const findUser= await User.findByPk(decoded?.id); 
        const cartUser= await Cart.findOne({where: {userId: findUser.id}});
        let order= await Order.findOne({where: {cartId: cartUser.id}});
        await order.update({status: status});
        return await Order.findOne({where: {id: order.id}});
    }
}

const changeStatusOD= async(status, orderId, modelId)=> {
    let findOrderDetail= await OrderDetail.findOne({where: {orderId: orderId, modelId: modelId}});
    await findOrderDetail.update({status: status});
    const newOrderDetail= await OrderDetail.findOne({where: {orderId: orderId, modelId: modelId}});
    const filterByOrder= await OrderDetail.findAll({where: {orderId: orderId}});
    const anyStatusPending= filterByOrder.filter(m=> m.status !== 'Impresión Finalizada');
    if(!anyStatusPending){
        let order= await Order.findByPk(orderId);
        await order.update({status: 'Impresión Finalizada'})
    } 
    
    return newOrderDetail;
}

const getOrderDetail= async()=> {

    const detailOrder= await Order.findAll({ 
        include: [
          {
            model: Model,
            through: {
              model: OrderDetail,
              attributes: ['quantity', 'subtotal', 'color']
            }
          }
        ]
      });

      return detailOrder;

}

const ordersForBilling= async()=> {
    const findOrders= await Order.findAll({
    where: {status: 'Impresión Finalizada'},
    include: [
        {
          model: Model,
          through: {
            model: OrderDetail,
            attributes: ['quantity', 'subtotal']
          }
        }
      ]
    });

    return findOrders;
}



module.exports= {newOrder, deleteInOrder, changeOrderStatus, getOrderDetail, changeStatusOD, ordersForBilling}