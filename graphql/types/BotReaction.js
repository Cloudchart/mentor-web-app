import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'

import {
  BotReactionStorage
} from '../../storage'


export default new GraphQLObjectType({

  name: 'BotReaction',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'BotReaction',

  fields: () => ({

    id: globalIdField('BotReaction'),

    scope: {
      type: GraphQLString,
    },

    mood: {
      type: new GraphQLNonNull(GraphQLString)
    },

    content: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })

})
