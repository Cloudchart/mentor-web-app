import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  EdgeType
} from '../connections/TopicLinkInsights'

import {
  InsightStorage,
  TopicLinkStorage,
  TopicLinkInsightStorage,
} from '../../storage'

import InsightType from '../types/InsightsType'
import TopicLinkType from '../types/TopicLinkType'


export default mutationWithClientMutationId({

  name: 'AddInsightToTopicLink',

  inputFields: {
    topicLinkID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    insightID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    insight: {
      type: new GraphQLNonNull(InsightType)
    },

    topicLink: {
      type: new GraphQLNonNull(TopicLinkType)
    },

    insightEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ insight }) => nodeToEdge(insight)
    }
  },

  mutateAndGetPayload: async ({ topicLinkID, insightID }, { rootValue: { viewer } }) => {
    let insight = await InsightStorage.load(fromGlobalId(insightID).id).catch(() => null)
    if (!insight) return new Error('Insight not found.')

    let topicLink = await TopicLinkStorage.load(fromGlobalId(topicLinkID).id).catch(() => null)
    if (!topicLink) return new Error('Topic link not found.')

    await TopicLinkInsightStorage.create({ insight_id: insight.id, topic_link_id: topicLink.id })

    return { insight, topicLink }
  }

})
