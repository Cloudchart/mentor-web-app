import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AdminStorage,
  TopicStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'


export default mutationWithClientMutationId({

  name: 'DeleteTopic',

  inputFields: () => ({

    topicID: {
      type: new GraphQLNonNull(GraphQLID)
    },

  }),

  outputFields: {

    topicID: {
      type: new GraphQLNonNull(GraphQLID),
    },

    admin: {
      type: new GraphQLNonNull(AdminType),
    }

  },

  mutateAndGetPayload: async ({ topicID }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let topic = await TopicStorage.load(fromGlobalId(topicID).id).catch(() => null)

    if (!topic)
      return new Error('Not found.')

    await TopicStorage.destroy(topic.id)

    let admin = await AdminStorage.load(viewer.id)

    return { topicID, admin }
  }

})
