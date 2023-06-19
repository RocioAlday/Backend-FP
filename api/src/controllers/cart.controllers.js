const { Cart, User, Model }= require('../db');

const getCartByUser= async(token)=> {
    if (token){
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const findUser= await User.findByPk(decoded?.id); 
        // const findUser= await User.findOne({where: {refreshToken: token}});
        const cart = await Cart.findOne({ where: { userId: findUser.id } });
        console.log('cartUser:' , cart);
    
        if(!cart) {
            let newCart= await Cart.create({ userId: findUser.id });
            return newCart;

        } else if (cart.items[0] !== null) {
        const itemsId = cart.items.map((item) => item.id);
        const modelsInCart= await Model.findAll({ where: { id: itemsId } });
        const allModelsCart = cart.items.map((item) => {

                const model = modelsInCart.find((m) => m.id === item.id);
                    return {
                    ...item,
                    ...model.toJSON()
                };
        });
        
        return { userId: findUser.id, items: allModelsCart };
        }
        return cart;
    } else {
        throw new Error('No RefreshToken in cookies');
    };

}

module.exports= { getCartByUser }