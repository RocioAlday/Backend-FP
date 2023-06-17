const { DataTypes } = require('sequelize');
const { Material, PriceType } = require("../utils/dataTypes");

module.exports= (sequelize)=> {
    sequelize.define('model', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
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
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'companyName'
        },
        image: {
            type: DataTypes.TEXT,
            field: 'image'
        }
    })
}