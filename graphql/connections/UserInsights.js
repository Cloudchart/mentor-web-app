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
  TopicStorage,
  InsightStorage,
  UserTopicInsightStorage,
} from '../../storage'

import {
  UpdateUserInsightsQueue
} from '../../Tasks'

import TopicType from '../types/TopicType'
import InsightType from '../types/InsightsType'


export const UserInsightFilter = new GraphQLEnumType({
  name: 'UserInsightFilter',

  values: {
    RATED:      { value: 'ratedForUser'     },
    UNRATED:    { value: 'unratedForUser'   },
    POSTPONED:  { value: 'postponedForUser' },
  }
})


export const Connection = connectionDefinitions({
  name: 'UserInsights',

  nodeType: InsightType,

  edgeFields: {
    topic: {
      type: new GraphQLNonNull(TopicType),
      resolve: async ({ node: { topic_id } }) => await TopicStorage.load(topic_id)
    }
  }
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
    filter: {
      type: UserInsightFilter,
      defaultValue: 'unratedForUser'
    },
  },

  resolve: async (user, { filter, ...args }) => {
    await UpdateUserInsightsQueue.perform({ user_id: user.id })

    let relations = await UserTopicInsightStorage.loadAll(filter, { user_id: user.id })
    let insights = await InsightStorage.loadMany(relations.map(relation => relation.insight_id))

    insights = relations.map(relation => ({
      ...insights.find(insight => relation.insight_id === insight.id),
      topic_id: relation.theme_id
    }))

    return {
      ...connectionFromArray(insights, args),
      user,
    }
  }
}
