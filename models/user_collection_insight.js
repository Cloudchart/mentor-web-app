export default function(sequelize, DataTypes) {
  return sequelize.define('UserCollectionInsight', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },

    user_collection_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

    insight_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

    is_useless: {
      type:           DataTypes.BOOLEAN,
      defaultValue:   false,
    }
  }, {

    tableName: 'user_collections_insights',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

};
