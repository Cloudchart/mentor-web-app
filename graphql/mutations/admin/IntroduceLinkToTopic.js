import {
  GraphQLID,
  GraphQLList,
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
} from '../../connections/arrayconnection'

import {
  TopicStorage,
  TopicLinkStorage,
  TopicLinkInsightStorage,
} from '../../../storage'

import TopicType from '../../types/TopicType'
import TopicLinkType from '../../types/TopicLinkType'

import {
  EdgeType
} from '../../connections/TopicLinksConnection'


export default mutationWithClientMutationId({

  name: 'IntroduceLinkToTopic',

  inputFields: {
    topicID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    linkURL: {
      type: new GraphQLNonNull(GraphQLString)
    },
    linkTitle: {
      type: new GraphQLNonNull(GraphQLString)
    },
    linkInsightsIDs: {
      type: new GraphQLList(GraphQLID)
    },
    reactionContent: {
      type: GraphQLString
    }
  },

  outputFields: {
    link: {
      type: new GraphQLNonNull(TopicLinkType),
    },

    linkEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ link }) => nodeToEdge(link)
    },

    topic: {
      type: new GraphQLNonNull(TopicType),
    }
  },

  mutateAndGetPayload: async ({ topicID, linkURL, linkTitle, linkInsightsIDs, reactionContent }, { rootValue: { viewer } }) => {
    // TODO: Check if viewer is admin

    let topic = await TopicStorage.load(fromGlobalId(topicID).id).catch(() => null)
    if (!topic) return new Error('Topic not found.')

    // Create Topic Link
    let link = await TopicLinkStorage.create({ topic_id: topic.id, url: linkURL, title: linkTitle })

    // Create Topic Link Insights relations
    await TopicLinkInsightStorage.createMany(linkInsightsIDs.map(id => ({ topic_link_id: link.id, insight_id: fromGlobalId(id).id })))

    return { link, topic }
  }

})
