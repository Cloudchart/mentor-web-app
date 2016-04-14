import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  TopicStorage
} from '../../../storage'

import SynchronizeThemeInsightsJob from '../../../workers/jobs/SynchronizeThemeInsightsJob'

import TopicType from '../../types/TopicType'

export default mutationWithClientMutationId({

  name: 'RefreshTopic',

  inputFields: {
    topicID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    topic: {
      type: new GraphQLNonNull(TopicType)
    }
  },

  mutateAndGetPayload: async ({ topicID }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let topic = await TopicStorage.load(fromGlobalId(topicID).id).catch(() => null)
    if (!topic)
      return new Error('Topic not found.')

    await SynchronizeThemeInsightsJob.perform({ themeID: topic.id, force: true })

    return { topic }
  }

})
