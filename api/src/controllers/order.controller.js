const { User, Cart, Order, Model, OrderDetail, OrderConfirmed }= require('../db');
const { transporter } = require("../config/nodemailer");
const fs = require('fs');

const imagePath = 'src/images/contact-image.png';
const imageData = fs.readFileSync(imagePath); // Lee la imagen como un archivo binario
const base64Image = imageData.toString('base64'); // Convierte los datos binarios en una cadena Base64

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
  const modifyOrder= await newOrder(id);
        
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
  // console.log ('rest', restOfModels);
  // console.log(filterByModel);
  const resultDetail= restOfModels.concat(filterByModel);
  const anyStatusPending= resultDetail.filter(m=> m.status !== 'Impresión Finalizada');
  const notDelivered= resultDetail.filter(m=> m.status !== 'Entregado');
  
  let date= new Date();
  if(!anyStatusPending.length && status === 'Impresión Finalizada'){
    let order= await OrderConfirmed.findByPk(orderId);
      await order.update({status: 'Impresión Finalizada', dataDetail: resultDetail, finishPrintDate: date.toISOString() });
     return order
  } else if (!notDelivered.length && status === 'Entregado') {
    let order= await OrderConfirmed.findByPk(orderId);
    await order.update({status: 'Entregado', dataDetail: resultDetail, deliveredDate: date.toISOString()});
   return order
  }
  let order= await OrderConfirmed.findByPk(orderId);
  await order.update({dataDetail: resultDetail});
  return order;
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
        priority: o.dataValues.priority,
        detailModels: dataDetail
      };
    })
  );
  return ordersDetail;
};


const confirmedOrder= async(id, orderId, status, dolarValue, observations)=> {
 
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
    priority: d.priority
   })
  })
 
  if(order && orderDetail){
    var orderConfirmed = await OrderConfirmed.create({
        id: orderId,
        userId: findUser.id,
        totalBudget: order.totalBudget*dolarValue,
        status: status,
        dataDetail: details,
        dolarValue: dolarValue,
        observations: observations 
    });
  }

  return orderConfirmed;
}

const changeStatusOrderConfirmed= async(orders)=> {
  let date= new Date();
  for (let order of orders) {
    let findOrder= await OrderConfirmed.findByPk(order.orderId);
    let modifyDetail= findOrder.dataDetail.map((d)=> {
      let detail= {...d};
      detail.status= order.status;
      return detail;
    })
 
    await findOrder.update({status: order.status, dataDetail: modifyDetail })
   
    switch (order.status) {
      case 'Entregado': 
        await findOrder.update({deliveredDate: date.toISOString()})
      case 'Facturado':
        await findOrder.update({billedDate: date.toISOString()})
      case 'Cobrado':
        await findOrder.update({collectDate: date.toISOString()})
    
    } 
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
        detailModels: dataDetail,
        fechaImpresionFinalizada: o.dataValues.finishPrintDate,
        fechaFacturado: o.dataValues.billedDate,
        fechaCobrado: o.dataValues.collectDate,
        fechaRetirado: o.dataValues.deliveredDate,
        observations: o.dataValues.observations
      };
    })
  )

  return ordersDetail;
}

const ordersForBilling= async()=> {
  
    const findOrders= await OrderConfirmed.findAll({
    where: { billedDate: null}});

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
          dolarValue: o.dataValues.dolarValue,
          observations: o.dataValues.observations
        };
      })
    );

    return ordersDetail;
  
}

const modifyOrderDashAdmin= async(orderId, modelId, status, quantity, material, color)=> {
  const order= await OrderConfirmed.findByPk(orderId);
  const orderDetail= order.dataDetail;
  const findModel= await Model.findByPk(modelId);
  await findModel.update({material: material});
  const modelPrice= findModel.price;
  
  let restOfModels= orderDetail.filter(d=> d.modelId !== modelId);  
  let filterByModel= orderDetail.find(d=> d.modelId === modelId);
  filterByModel.status = status; 
  filterByModel.quantity= Number(quantity);
  filterByModel.subtotal= modelPrice * Number(quantity) * Number(order.dolarValue);
  filterByModel.color= color;

  const resultDetail= restOfModels.concat(filterByModel);

  let totalPrice= 0;
  for (const model of resultDetail) {
    totalPrice += model.subtotal;
  }

  const anyPendingDeliver= resultDetail.filter(m=> m.status !== 'Entregado');
  const anyPendingBill= resultDetail.filter(m=> m.status !== 'Facturado');
  const anyPendignCollect= resultDetail.filter(m => m.status !== 'Cobrado');
  let date= new Date();
  if(!anyPendingDeliver.length || !anyPendingBill.length || !anyPendignCollect.length){
    let changeDate= !anyPendingDeliver.length? 'deliveredDate' : (!anyPendingBill.length? 'billedDate' : 'collectDate');
   
    await order.update({ status: status, totalBudget: totalPrice, dataDetail: resultDetail, [changeDate]: date.toISOString()});
    return order
  }

  await order.update({ status: status, totalBudget: totalPrice, dataDetail: resultDetail});
  return order;
}

const changePriority= async(orderId,modelId, priority)=> {
  const order= await OrderConfirmed.findByPk(orderId);
  const details= order.dataDetail;
  let restOfModels= details.filter(d=> d.modelId !== modelId);  
  let filterByModel= details.find(d=> d.modelId === modelId);
  filterByModel.priority= priority;

  const resultDetail= restOfModels.concat(filterByModel);
  let newOrder= await OrderConfirmed.findByPk(orderId);
  await newOrder.update({dataDetail: resultDetail});
  return newOrder
}

const postDataForBudgetOrder= async(id, orderId, dolarValue, observations)=> {
  const findOrder= await Order.findOne({where: {id: orderId},
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
  return ({
    order: findOrder,
    dolarValue: dolarValue,
    observations: observations
  })
}

const sendBudgetEmail= async(id, pdf)=> {
  const findUser= await User.findByPk(id); 
  const USER_EMAIL= findUser.email;

  const mailOptions = {
    from:  process.env.USER_GMAIL,
    to: USER_EMAIL,   
    subject: "Presupuesto",

    html:
        `
            <table border="0" cellpadding="0" cellspacing="0" width="900px">
            <tr>
                <td style="text-align:left">
                <p style="color: #000"><em>Estimado Cliente, nos complace que estés considerando nuestro presupuesto. 
                    Si tienes alguna pregunta o necesitas más información antes de tomar una decisión, no dudes en contactarte con nosotros. <br/>
                    ¡Estamos para ayudarte en lo que necesites! <br/><br/>
                    Adjuntamos el presupuesto solicitado. <br/>
                    ¡Gracias por considerar nuestra propuesta! </em><br/><br/>
                    <strong>El Equipo de FullPrism.</strong>
                    </p>
                </td>
            </tr>
            <tr height="200px">  
                <td width="400px">
                    <img src="cid:imagen-contacto" width="400px" />
                </td>
            </tr>
           
        </table>
            </body>
        </html>`
    ,

    attachments: [
      { filename: "presupuesto.pdf",  
         content: pdf }, 
      {
        filename: 'datos-contacto.png',
        content: imageData,
        cid: 'imagen-contacto'
      },],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw new Error(`Error sending mail: ${error}`);
  });
}


module.exports= {newOrder, deleteInOrder, changeOrderStatus, getOrderDetail, changeStatusOD, ordersForBilling, ordersByUser, 
  confirmedOrder, deleteOrderCtrl, changeStatusOrderConfirmed, modifyOrderDashAdmin, changePriority, postDataForBudgetOrder, sendBudgetEmail}