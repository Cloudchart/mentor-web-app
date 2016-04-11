import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'


export default new GraphQLObjectType({

  name: 'AdminTheme',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'AdminTheme',

  fields: () => ({

    id: globalIdField('AdminTheme'),

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
    },

    createdAt: {
      type: GraphQLString,
      resolve: theme => theme.created_at
    },

  })

})
