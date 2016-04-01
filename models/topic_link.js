export default function(sequelize, DataTypes) {
  return sequelize.define('TopicLink', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },

    topic_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

    url: {
      type:           DataTypes.STRING,
      allowNull:      false,
    },

    title: {
      type:           DataTypes.STRING,
      defaultValue:   false,
    }
  }, {

    tableName: 'topic_links',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

};
