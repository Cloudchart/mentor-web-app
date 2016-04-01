export default function(sequelize, DataTypes) {
  return sequelize.define('TopicLinkInsight', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },

    topic_link_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },

    insight_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
  }, {
    tableName: 'topic_links_insights',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

};
