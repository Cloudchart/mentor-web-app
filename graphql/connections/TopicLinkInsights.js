import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'

import {
  InsightStorage,
  TopicLinkInsightStorage,
} from '../../storage'


import InsightType from '../types/InsightsType'


export const Connection = connectionDefinitions({
  name: 'TopicLinkInsights',

  nodeType: InsightType,
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (topic_link, { ...args }) => {
    let relations = await TopicLinkInsightStorage.loadAll('forTopicLink', { topic_link_id: topic_link.id })
    let insights = await InsightStorage.loadMany(relations.map(r => r.insight_id))
    return {
      ...connectionFromArray(insights, args),
      topic_link: topic_link,
    }
  }
}
