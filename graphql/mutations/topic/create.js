import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeToEdge
} from '../../connections/arrayconnection'

import {
  EdgeType
} from '../../connections/AdminTopics'

import {
  AdminStorage,
  TopicStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'
import TopicType from '../../types/TopicType'


export default mutationWithClientMutationId({

  name: 'CreateTopic',

  inputFields: {

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    description: {
      type: GraphQLString,
    },

  },

  outputFields: {

    topicEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ topic }) => nodeToEdge(topic)
    },

    admin: {
      type: new GraphQLNonNull(AdminType)
    }

  },

  mutateAndGetPayload: async ({ name, description }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let topic = await TopicStorage.create({ name, description })

    let admin = await AdminStorage.load(viewer.id)

    return { topic, admin }
  }

})
