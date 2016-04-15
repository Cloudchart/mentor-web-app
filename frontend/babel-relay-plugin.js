var BabelRelayPlugin = require('babel-relay-plugin')
var GraphQLSchema = require('../graphql/schema.json')

module.exports = BabelRelayPlugin(GraphQLSchema.data)
