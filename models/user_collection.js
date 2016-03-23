export default function(sequelize, DataTypes) {
  return sequelize.define('UserCollection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {

    tableName: 'user_collections',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });
};
