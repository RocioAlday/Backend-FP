const { DataTypes } = require('sequelize');
const { PriceType } = require('../utils/dataTypes');

module.exports= (sequelize)=> {
    sequelize.define('orderConfirmed', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        totalBudget: {
            type: PriceType,
            field: 'TotalBudget'
        },
        status: {
            type: DataTypes.ENUM("Confirmado", "Impresión Finalizada", "Entregado", "Facturado", "Cobrado", "Cerrada"),
            allowNull: false,
            defaultValue: "Confirmado",
            field: "Status",
        },
        dataDetail: {
            type: DataTypes.ARRAY(DataTypes.JSON), 
            defaultValue: []
        },
        dolarValue: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            field: "DolarValue",
        }
    })
}