const { DataTypes } = require('sequelize');
const { PriceType } = require('../utils/dataTypes');

module.exports= (sequelize)=> {
    sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        totalBudget: {
            type: PriceType,
            field: 'TotalBudget'
        },
        status: {
            type: DataTypes.ENUM("Pendiente", "Confirmado"),
            allowNull: false,
            defaultValue: "Pendiente",
            field: "Status",
        },
        observations: {
            type: DataTypes.TEXT,
            field: 'observations'
        }


    })
}
