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
            type: DataTypes.ENUM("Confirmado", "Presupuesto Confirmado", "Impresión Finalizada", "Entregado", "Facturado", "Cobrado", "Cerrada"),
            allowNull: false,
            defaultValue: "Confirmado",
            field: "Status",
        },
        dataDetail: {
            type: DataTypes.ARRAY(DataTypes.JSON), 
            defaultValue: []
        },
        dolarValue: {
            type: DataTypes.DECIMAL(6,2),
            allowNull: false,
            field: "DolarValue",
        },
        finishPrintDate: {
            type: DataTypes.STRING,
            field: "DateFinishPrint"
        },
        billedDate: {
            type: DataTypes.STRING,
            field: "BilledDate"
        },
        collectDate: {
            type: DataTypes.STRING,
            field: "CollectDate"
        },
        deliveredDate: {
            type: DataTypes.STRING,
            field: "DeliveredDate"
        },
        observations: {
            type: DataTypes.TEXT,
            field: 'Observations'
        }
    })
}