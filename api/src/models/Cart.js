const { DataTypes } = require('sequelize');

module.exports= (sequelize)=> {
    sequelize.define('cart', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        items: {
            type: DataTypes.ARRAY(DataTypes.JSON),  //recibiria como dato el name de la pieza, color, cantidad
            defaultValue: []
      }
    })
}
