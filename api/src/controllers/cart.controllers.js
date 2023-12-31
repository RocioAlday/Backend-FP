const { Cart, User, Model }= require('../db');

const getCartByUser= async(id)=> {
   
    const findUser= await User.findByPk(id); 
    const cart = await Cart.findOne({ where: { userId: findUser.id } });
    console.log('cartUser:' , cart);
       
        if(!cart) {
            let newCart= await Cart.create({ userId: findUser.id });
            return newCart;

        } else if (cart.items[0] !== null) {
        const itemsId = cart.items.map((item) => item.id);
        const modelsInCart= await Model.findAll({ where: { id: itemsId } });
        console.log(modelsInCart);
        const allModelsCart = cart.items.map((item) => {

                const model = modelsInCart.find((m) => m.id === item.id);
                console.log(model);
            
                return {
                    ...item,
                    ...model.toJSON()
                };
                
        });
        
        return { userId: findUser.id, items: allModelsCart };
        }
        return cart;

}

const eliminateCart= async(id)=> {
    const findUser= await User.findByPk(id); 
    const cart = await Cart.findOne({ where: { userId: findUser.id } });
    await cart.destroy();
    return;
}


module.exports= { getCartByUser, eliminateCart }