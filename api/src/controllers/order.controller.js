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
        for (const item of cartUser.items) {       //chequear q en la order haya solo items q esten en la cart, sino elimionarlo de la order 
            const model= await Model.findByPk(item.id);
            cartModels.push(model);
            const subtotal= item.quantity * model.price;
            await order.addModel(model, {
                through: {quantity: item.quantity, subtotal: subtotal}
            })
        }
        console.log(cartModels);
        
        let totalPrice= 0;
        let removeModel= [];
        const allModelsOrder= await order.getModels(); 
        for (const model of allModelsOrder) {
            removeModel= [...removeModel, ...cartModels.filter(m=> m.id !== model.id)];
            totalPrice += model.price * model.OrderDetail.quantity;
        }
        console.log(removeModel);
        await order.update({totalBudget: totalPrice});
        
        const orderDetails = await Order.findOne({ 
            where: {id: order.id},
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

        return orderDetails;
      }
    } else {
        throw new Error('No RefreshToken in cookies');
    }
      
};





module.exports= {newOrder}