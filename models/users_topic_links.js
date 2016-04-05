export default function(sequelize, DataTypes) {
  return sequelize.define('UserTopicLink', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },

    topic_link_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

    user_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

  }, {

    tableName: 'users_topic_links',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

};
