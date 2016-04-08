import {
  GraphQLInt,
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

  name: 'Question',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Question'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    isPublished: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_published }) => is_published
    },

    severity: {
      type: new GraphQLNonNull(GraphQLInt)
    },

  })

})
