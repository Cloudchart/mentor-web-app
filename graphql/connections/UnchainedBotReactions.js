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
  },

  resolve: async (root, { ...args }, { viewer }) => {
    let reactions = await BotReactionStorage.loadAll('unchained')
    return {
      ...connectionFromArray(reactions, args)
    }
  }
}
