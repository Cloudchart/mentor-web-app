module.exports = function(sequelize, DataTypes) {
  var FollowUp = sequelize.define('FollowUp', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
    },

    rate:             DataTypes.INTEGER,

  }, {
    tableName: 'follow_ups',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return FollowUp;
};
