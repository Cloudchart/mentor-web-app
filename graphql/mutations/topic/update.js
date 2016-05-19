import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  AdminStorage,
  TopicStorage,
} from '../../../storage'

import {
  nodeToEdge
} from '../../connections/arrayconnection'

import {
  EdgeType
} from '../../connections/AdminTopics'

import AdminType from '../../types/admin/AdminType'
import TopicType from '../../types/TopicType'


export default mutationWithClientMutationId({

  name: 'UpdateTopic',

  inputFields: {
    topicID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    description: {
      type: GraphQLString
    },
  },

  outputFields: {
    topic: {
      type: new GraphQLNonNull(TopicType)
    },

    topicEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ topic }) => nodeToEdge(topic)
    },

    admin: {
      type: new GraphQLNonNull(AdminType)
    }
  },

  mutateAndGetPayload: async ({ topicID, name, description }, { rootValue: { viewer } }) => {
    let admin = await AdminStorage.load(viewer.id).catch(() => null)

    if (!admin)
      return new Error('Not authorized.')

    let topic = await TopicStorage.load(fromGlobalId(topicID).id).catch(() => null)
    if (!topic)
      return new Error('Topic not found.')

    topic = await TopicStorage.update(topic.id, { name, description })

    return { topic, admin }
  }

})
