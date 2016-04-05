import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  EdgeType
} from '../connections/TopicLinksConnection'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  TopicStorage,
  TopicLinkStorage,
  UserTopicLinkStorage,
} from '../../storage'

import TopicType from '../types/TopicType'
import TopicLinkType from '../types/TopicLinkType'


export default mutationWithClientMutationId({

  name: 'MarkTopicLinkAsRead',

  inputFields: {
    topicLinkID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    topicLink: {
      type: new GraphQLNonNull(TopicLinkType)
    },
    topic: {
      type: new GraphQLNonNull(TopicType)
    },
    topicLinkID: {
      type: new GraphQLNonNull(GraphQLString)
    },
    topicLinkEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ topicLink }) => nodeToEdge(topicLink)
    }
  },

  mutateAndGetPayload: async ({ topicLinkID }, { rootValue: { viewer } }) => {
    let topicLink = await TopicLinkStorage.load(fromGlobalId(topicLinkID).id).catch(() => null)
    if (!topicLink)
      return new Error('Topic Link not found.')

    let topic = await TopicStorage.load(topicLink.topic_id)

    let userTopicLink = await UserTopicLinkStorage.loadOne('allForUserAndTopicLink', { user_id: viewer.id, topic_link_id: topicLink.id })
    if (!userTopicLink)
      await UserTopicLinkStorage.create({ user_id: viewer.id, topic_link_id: topicLink.id })

    return { topicLink, topicLinkID, topic }
  }

})
