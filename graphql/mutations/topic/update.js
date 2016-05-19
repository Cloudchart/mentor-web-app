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
  TopicStorage
} from '../../../storage'

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
    }
  },

  mutateAndGetPayload: async ({ topicID, name, description }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let topic = await TopicStorage.load(fromGlobalId(topicID).id).catch(() => null)
    if (!topic)
      return new Error('Topic not found.')

    topic = await TopicStorage.update(topic.id, { name, description })

    return { topic }
  }

})
