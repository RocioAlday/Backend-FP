const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    // definición de atributos del modelo
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'model',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    observations: {
        type: DataTypes.TEXT,
        field: 'observations'
    }
  });

  return OrderDetail;
};