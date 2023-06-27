const { newOrder } = require("../controllers/order.controller");

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



// async function approveOrder(orderId) {
//     const order = await Order.findOne({ 
//       where: { id: orderId },
//       include: [
//         {
//           model: Videogame,
//           through: {
//             model: OrdersDetail,
//             attributes: ['quantity', 'subtotal']
//           }
//         }
//       ]
//     });
//      //console.log(order);
  
//     if (!order) {
//       throw new Error ('No se encontró la orden');
//     };
  
//     let allVideogames= await Videogame.findAll();
   
//     const videogamesOrder= order.videogames.map(v => ({
//       id: v.id,
//       quantity: v.OrdersDetail.quantity
//     }));
  
//     videogamesOrder.forEach(async (v) => {
//       const product= allVideogames.find( p=> p.dataValues.id === v.id );
//       if (product.dataValues.stock < 1) throw new Error (`Without Stock of: "${product.dataValues.name}" videogame`);
//       product.dataValues.stock -= v.quantity; 
//       const findVideogame= await Videogame.findByPk(product.dataValues.id);
//       await findVideogame.update({
//         stock: product.dataValues.stock
//       });
//     });


module.exports= {createOrder, modifyOrder}