export default (sequelize, DataTypes) =>
  sequelize.define('FollowUp', {

    id: {
      type:       DataTypes.UUID,
      primaryKey: true,
    },

    rate: DataTypes.INTEGER

  }, {

    tableName:    'follow_ups',
    underscored:  true

  })
