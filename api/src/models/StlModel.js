const { DataTypes } = require('sequelize');
const { Material } = require("../utils/dataTypes");

module.exports= (sequelize)=> {
    sequelize.define('model', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'Id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'name'
        },
        material: {
            type: Material,
            allowNull: false,
            field: 'material'
        },
        link: {
            type: DataTypes.TEXT,
        },
        price: {
            type: PriceType
        }
    })
}