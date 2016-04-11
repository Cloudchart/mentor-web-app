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

import BotReactionOwnerInterface, {
  Resolve as resolveReaction
} from '../interfaces/BotReactionOwner'


export default new GraphQLObjectType({

  name: 'Answer',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'Answer',

  fields: () => ({

    id: globalIdField('Answer'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    position: {
      type: new GraphQLNonNull(GraphQLInt),
    },

    reaction: {
      type: BotReactionType,
      resolve: resolveReaction,
    }

  })

})


import BotReactionType from './BotReaction'
