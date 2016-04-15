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


const Reactions = {
  'clicker': {
    items: [
      {
        id: '1',
        content: 'Any pressing matters, Master?',
        mood: 'positive',
        weight: 1,
        __type: 'BotReaction'
      }, {
        id: '2',
        content: 'See, the icon works. Now back to your work, human.',
        mood: 'positive',
        weight: 2,
        __type: 'BotReaction'
      }, {
        id: '3',
        content: 'I mean it. Tap into knowledge, not on my fancy icon!',
        mood: 'negative',
        weight: 3,
        __type: 'BotReaction'
      }
    ],
    resolve: () => Reactions.clicker.items
  },
  'greetings': {
    items: [
      {
        id: '3',
        content: 'Adve… Review time!',
        mood: 'positive',
        weight: 1,
        __type: 'BotReaction'
      }, {
        id: '4',
        content: 'An advice without a follow-up is like Andreessen without Horowitz.',
        mood: 'negative',
        weight: 1,
        __type: 'BotReaction'
      }
    ],
    resolve: () => {
      let index = Math.round(Math.random() * 2)
      let item = Reactions.greetings.items[index]
      return item ? [item] : []
    }
  }
}

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
    let reactions = Reactions[scope] && Reactions[scope].resolve() || []
    return {
      ...connectionFromArray(reactions, args)
    }
  }
}
