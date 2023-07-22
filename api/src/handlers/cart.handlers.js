const {Cart} = require('../db');
const { getCartByUser, eliminateCart }= require('../controllers/cart.controllers');


const getCart = async (req, res) => {

  const { id }= req.user;
  try {
    
    const cartUser= await getCartByUser(id);
    console.log(cartUser);
    res.status(200).json(cartUser);

  } catch (error) {
    res.status(500).json({ error: 'Error Getting Cart By User', message: error.message });
  }
};


const modifyCart = async (req, res) => {
  const { id }= req.user;
 
  //  var token = req.cookies.refreshToken; 
  //  console.log(token);
   const product = req.body.product;
  // console.log(product);
    try {
      var cart= await getCartByUser(id);
      // console.log('HANDLER CART', cart);
      var findCartDB= await Cart.findOne({where: {userId: cart.userId}});

      if (product && cart.items.length > 0){
        var itemsCart= findCartDB.items.filter(i=> i.id === product.id);
        // console.log('itemsCart:', itemsCart);

        if(itemsCart.length>0){
          var modifyItem= {id: itemsCart[0].id, quantity: product.quantity, color: product.color}; 
          let restItems= findCartDB.items.filter(el => el.id !== modifyItem.id);
          let newItems = restItems.concat(modifyItem);
          newItems= newItems.filter(i=> i.quantity !== 0);
          await findCartDB.update({items: newItems});
          const updateCart= await Cart.findOne({where: {userId: cart.userId}});
       
          return res.status(201).json(updateCart);
        }
      
      } if (product && product.quantity>0) {
          let newItems= [...findCartDB.items, product];
          await findCartDB.update({ items: newItems });
          let updateCart= await Cart.findOne({where: {userId: cart.userId}});
         return res.status(201).json(updateCart);
      };
        
      res.status(201).json(cart);
    
   
    } catch (error) {
      res.status(500).json({ error: 'Error adding item on Cart', message: error.message })
    }
  };

const deleteCart= async(req, res)=> {
  const { id }= req.user;
  try{
    await eliminateCart(id);
    res.status(200).json({message: 'Cart Empty'})
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Cart', message: error.message })
  }
}


  module.exports= { getCart, modifyCart, deleteCart };