import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'

export default new GraphQLObjectType({

  name: 'Theme',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Theme'),

    name: {
      type: GraphQLString
    },

    isSystem: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_system }) => !!is_system
    },

    isDefault: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_default }) => !!is_default
    }

  })

})
