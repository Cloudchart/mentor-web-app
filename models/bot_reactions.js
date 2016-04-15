export default function(sequelize, DataTypes) {
  return sequelize.define('BotReaction', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },

    owner_id: {
      type:           DataTypes.UUID,
      allowNull:      true,
    },

    owner_type: {
      type:           DataTypes.STRING,
      allowNull:      true,
    },

    scope: {
      type:           DataTypes.STRING,
      allowNull:      true,
    },

    mood: {
      type:           DataTypes.ENUM,
      values:         ['positive', 'negative'],
      defaultValue:   'positive',
    },

    content: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
  }, {
    tableName: 'bot_reactions',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

};
