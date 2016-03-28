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
} from '../../storage'

import TopicType from '../types/TopicType'
import InsightType from '../types/InsightsType'

import SynchronizeUserThemeInsightsJob from '../../workers/jobs/SynchronizeUserThemeInsightsJob'


export const TopicInsightsConnectionFilterEnum = new GraphQLEnumType({
  name: 'TopicInsightsFilterEnum',

  values: {
    ALL:      { value: 'all'      },
    RATED:    { value: 'rated'    },
    UNRATED:  { value: 'unrated'  },
    LIKED:    { value: 'liked'    },
    DISLIKED: { value: 'disliked' },
  }
})


const TopicInsightsConnection = connectionDefinitions({
  name: 'TopicInsights',

  nodeType: InsightType,

  connectionFields: {
    ratedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ topic, user }) =>
        await InsightStorage
          .loadAllIDs('ratedForTopicAndUser', { userID: user.id, topicID: topic.id })
          .then(ids => ids.length)
    },

    unratedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ topic, user }) =>
        await InsightStorage
          .loadAllIDs('unratedForTopicAndUser', { userID: user.id, topicID: topic.id })
          .then(ids => ids.length)
    }
  }
})


export const TopicInsightsEdgeType = TopicInsightsConnection.edgeType
export const TopicInsightsConnectionType = TopicInsightsConnection.connectionType


export default {
  type: TopicInsightsConnectionType,

  args: {
    ...connectionArgs,
    filter: {
      type: TopicInsightsConnectionFilterEnum,
      defaultValue: 'unrated'
    }
  },

  resolve: async (topic, { filter, ...args }, { rootValue: { viewer } }) => {
    await SynchronizeUserThemeInsightsJob.perform({ userID: viewer.id, themeID: topic.id })
    let insights = await InsightStorage.loadAll(filter + 'ForTopicAndUser', { userID: viewer.id, topicID: topic.id })
    return {
      ...connectionFromArray(insights, args),
      topic:  topic,
      user:   viewer,
    }
  }
}
