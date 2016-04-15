import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  BotReactionStorage
} from '../../storage'

import {
  connectionFromArray
} from './arrayconnection'

import BotReactionType from '../types/BotReaction'


export const Connection = connectionDefinitions({

  name: 'UnchainedBotReactions',

  nodeType: BotReactionType,

})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {

  type: ConnectionType,

  args: {
    ...connectionArgs,
    scope: {
      type: GraphQLString
    }
  },

  resolve: async (root, { scope, ...args }, { viewer }) => {
    let reactions = []
    return {
      ...connectionFromArray(reactions, args)
    }
  }
}
