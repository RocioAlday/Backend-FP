const { DataTypes } = require('sequelize');
const {RoleType, StatusType} = require("../utils/dataTypes");

module.exports= (sequelize)=> {
    sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "Id"
        },
        companyName: {
            type: DataTypes.STRING,
            field: "CompanyName",
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            field: "Firstname",
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            field: 'Email',
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            field: 'Phone'
        },
        img: {
            type: DataTypes.TEXT,
            field: 'Image'
        },
        role: {
            type: RoleType,
            allowNull: false,
            defaultValue: "Client",
            field: "Role",
        },
        password: {
            type: DataTypes.STRING,
            field: "Password",
          },
        status: {
            type: StatusType,
            allowNull: false,
            defaultValue: "Active",
            field: "Status",
        },
        refreshToken: {
            type: DataTypes.STRING,
        }
    })
}
