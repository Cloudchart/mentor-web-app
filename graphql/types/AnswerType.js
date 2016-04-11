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

  name: 'Answer',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Answer'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    position: {
      type: new GraphQLNonNull(GraphQLInt),
    },

  })

})
