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
  TopicLinkStorage,
  BotReactionStorage,
} from '../../storage'


import BotReactionType from './BotReaction'
import TopicLinkInsightsConnection from '../connections/TopicLinkInsights'


export default new GraphQLObjectType({

  name: 'TopicLink',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('TopicLink'),

    url: {
      type: new GraphQLNonNull(GraphQLString)
    },

    title: {
      type: new GraphQLNonNull(GraphQLString)
    },

    reaction: {
      type: new GraphQLNonNull(BotReactionType),
      resolve: async (topicLink) => await BotReactionStorage.loadOne('forOwner', { owner_id: topicLink.id, owner_type: 'TopicLink' })
    },

    insights: TopicLinkInsightsConnection

  })

})
