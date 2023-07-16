const { User, Cart, Order, Model, OrderDetail, OrderConfirmed }= require('../db');
const jwt= require('jsonwebtoken');

const newOrder= async(id) => {
  const findUser= await User.findByPk(id); 
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
      // console.log(cartModels);

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
};


const deleteInOrder= async(id)=> {
    
  const findUser= await User.findByPk(id); 
  const cartUser= await Cart.findOne({where: {userId: findUser.id}});
  let order= await Order.findOne({where: {cartId: cartUser.id}});
  await order.destroy();
  const modifyOrder= await newOrder(token);
        
  return modifyOrder;
}

const deleteOrderCtrl= async(id, orderId)=> {
  
  const findUser= await User.findByPk(id); 
  const cartUser= await Cart.findOne({where: {userId: findUser.id}});
  let order= await Order.findOne({where: {id: orderId}});
  await order.destroy();
  await cartUser.update({items: []});
  return;
}

const changeOrderStatus= async(id, status)=> {
    
  const findUser= await User.findByPk(id); 
  const cartUser= await Cart.findOne({where: {userId: findUser.id}});
  let order= await Order.findOne({where: {cartId: cartUser.id}});
  await order.update({status: status});
  return await Order.findOne({where: {id: order.id}});
}

const changeStatusOD= async(status, orderId, modelId)=> {
  let findOrder= await OrderConfirmed.findOne({where: {id: orderId}});
  let detail= findOrder.dataDetail;
  let restOfModels= detail.filter(d=> d.modelId !== modelId);  
  let filterByModel= detail.filter(d=> d.modelId === modelId);
  filterByModel[0].status = status;
  console.log ('rest', restOfModels);
  console.log(filterByModel);
  const resultDetail= restOfModels.concat(filterByModel);
  console.log(resultDetail);
  const anyStatusPending= resultDetail.filter(m=> m.status !== 'Impresión Finalizada');

  if(anyStatusPending.length<1){
    let updateOrder= await OrderConfirmed.findOne({where: {id: orderId}});
      await updateOrder.update({status: 'Impresión Finalizada', dataDetail: resultDetail});
      let dateUpdate= findOrder.updatedAt;
      return [updateOrder, {finishDatePrint: dateUpdate}]
  } 

  await findOrder.update({dataDetail: resultDetail});
  return resultDetail;
}


const getOrderDetail = async () => {
  const orders = await OrderConfirmed.findAll();
  const ordersDetail = await Promise.all(
    orders.map(async (o) => {
      const dataDetail = await Promise.all(
        o.dataDetail.map(async (detail) => {
          const modelId = detail.modelId;
          const modelData = await Model.findOne({ where: { id: modelId } });
          const modelDataValues = modelData.dataValues;
          return { ...detail, ...modelDataValues };
        })
      );
      return {
        orderId: o.dataValues.id,
        userId: o.dataValues.userId,
        totalBudget: o.dataValues.totalBudget,
        status: o.dataValues.status,
        fechaSolicitud: o.dataValues.createdAt,
        detailModels: dataDetail
      };
    })
  );
  return ordersDetail;
};


const confirmedOrder= async(id, orderId, status, dolarValue)=> {
 
  const findUser= await User.findByPk(id); 
  const order= await Order.findByPk(orderId);
  const orderDetail= await OrderDetail.findAll({where: {orderId: order.id}});
  const details= orderDetail.map((d)=> {
    return ({
    modelId: d.modelId,
    quantity: d.quantity,
    subtotal: d.subtotal*dolarValue,
    color: d.color,
    status: d.status,
   })
  })
 
  if(order && orderDetail){
    var orderConfirmed = await OrderConfirmed.create({
        userId: findUser.id,
        totalBudget: order.totalBudget*dolarValue,
        status: status,
        dataDetail: details,
        dolarValue: dolarValue 
    });
  }

  return orderConfirmed;
}

const changeStatusOrderConfirmed= async(orders)=> {
  for (let order of orders) {
    let findOrder= await OrderConfirmed.findByPk(order.id);
    await findOrder.update({status: order.status})
  }
 
  return ('Order Status Changed Successfully')
}

const ordersByUser= async(id)=> {
  const findUser= await User.findByPk(id); 
  const order= await OrderConfirmed.findAll({where: {userId : findUser.id}});
  const openOrders= order.filter(o=> o.status !== 'Cerrada');
  const ordersDetail= await Promise.all(
    openOrders.map(async(o)=> {
      const dataDetail = await Promise.all(
        o.dataDetail.map(async (detail) => {
          const modelId = detail.modelId;
          const modelData = await Model.findOne({ where: { id: modelId } });
          const modelDataValues = modelData.dataValues;
          return { ...detail, ...modelDataValues };
        })
      );
      return {
        orderId: o.dataValues.id,
        userId: o.dataValues.userId,
        totalBudget: o.dataValues.totalBudget,
        status: o.dataValues.status,
        fechaSolicitud: o.dataValues.createdAt,
        detailModels: dataDetail
      };
    })
  )

  return ordersDetail;
}

const ordersForBilling= async()=> {
  
    const findOrders= await OrderConfirmed.findAll({
    where: {status: 'Impresión Finalizada'}});

    const ordersDetail = await Promise.all(
      findOrders.map(async (o) => {
        const dataDetail = await Promise.all(
          o.dataDetail.map(async (detail) => {
            const modelId = detail.modelId;
            const modelData = await Model.findOne({ where: { id: modelId } });
            const modelDataValues = modelData.dataValues;
            return { ...detail, ...modelDataValues };
          })
        );
        return {
          orderId: o.dataValues.id,
          userId: o.dataValues.userId,
          totalBudget: o.dataValues.totalBudget,
          status: o.dataValues.status,
          fechaSolicitud: o.dataValues.createdAt,
          detailModels: dataDetail,
          dolarValue: o.dataValues.dolarValue
        };
      })
    );

    return ordersDetail;
  
}



module.exports= {newOrder, deleteInOrder, changeOrderStatus, getOrderDetail, changeStatusOD, ordersForBilling, ordersByUser, 
  confirmedOrder, deleteOrderCtrl, changeStatusOrderConfirmed}