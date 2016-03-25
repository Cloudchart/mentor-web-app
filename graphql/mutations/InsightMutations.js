import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  toGlobalId,
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  TopicStorage,
  InsightStorage,
  UserCollectionStorage,
  UserTopicInsightStorage,
  UserCollectionInsightStorage,
} from '../../storage'

import InsightType from '../types/InsightsType'
import TopicType from '../types/TopicType'
import UserCollectionType from '../types/UserCollectionType'


const MutationsInputFields = {
  insightID: {
    type: new GraphQLNonNull(GraphQLID)
  }
}

const MutationsOutputFields = {
  insight: {
    type: new GraphQLNonNull(InsightType)
  },
  insightID: {
    type: new GraphQLNonNull(GraphQLID)
  }
}

const TopicMutationsInputFields = {
  ...MutationsInputFields,
  topicID: {
    type: new GraphQLNonNull(GraphQLID)
  },
}

const TopicMutationsOutputFields = {
  ...MutationsOutputFields,
  insightEdge: {
    type: GraphQLString
  }
}

const UserCollectionMutationsInputFields = {
  ...MutationsInputFields,
  collectionID: {
    type: new GraphQLNonNull(GraphQLID)
  },
}

const UserCollectionMutationsOutputFields = {
  ...MutationsOutputFields,
  insightEdge: {
    type: GraphQLString
  }
}

let mutateAndGetPayloadForTopicMutation = (rate) =>
  async ({ insightID, topicID, shouldAddToUserCollectionWithTopicName }, { rootValue: { viewer } }) => {
    let link = await UserTopicInsightStorage.loadOne('unique', {
      user_id:    viewer.id,
      topic_id:   fromGlobalId(topicID).id,
      insight_id: fromGlobalId(insightID).id
    }).catch(error => null)

    if (!link)
      return new Error('Not found.')

    await UserTopicInsightStorage.update(link.id, { rate })

    let insight = await InsightStorage.load(fromGlobalId(insightID).id)

    if (shouldAddToUserCollectionWithTopicName) {
      let topic = await TopicStorage.load(fromGlobalId(topicID).id)
      let userCollection = await UserCollectionStorage.loadOrCreateBy({ name: topic.name, user_id: viewer.id })
      await UserCollectionInsightStorage.loadOrCreateByUserCollectionAndInsight({
        user_collection_id:   userCollection.id,
        insight_id:           insight.id
      })
    }

    return { insight, insightID }
  }


let mutateAndGetPayloadForUserCollectionMutation = (is_useless) =>
  async ({ insightID, collectionID }, { rootValue: { viewer } }) => {
    return new Error('Not implemented.')
  }

// Like Insight in Topic
//
export const LikeInsightInTopicMutation = mutationWithClientMutationId({
  name: 'LikeInsightInTopicMutation',

  inputFields: {
    ...TopicMutationsInputFields,
    shouldAddToUserCollectionWithTopicName: {
      type: GraphQLBoolean,
      defaultValue: false,
    }
  },

  outputFields: {
    ...TopicMutationsOutputFields,
  },

  mutateAndGetPayload: mutateAndGetPayloadForTopicMutation(1)

})


// Dislike Insight in Topic
//
export const DislikeInsightInTopicMutation = mutationWithClientMutationId({
  name: 'DislikeInsightInTopicMutation',

  inputFields: {
    ...TopicMutationsInputFields,
  },

  outputFields: {
    ...TopicMutationsOutputFields,
  },

  mutateAndGetPayload: mutateAndGetPayloadForTopicMutation(-1)
})


// Add Insight to Collection
//
export const AddInsightToCollectionMutation = mutationWithClientMutationId({
  name: 'AddInsightToCollectionMutation',

  inputFields: {
    ...UserCollectionMutationsInputFields,
  },

  outputFields: {
    ...UserCollectionMutationsOutputFields,
  },

  mutateAndGetPayload: mutateAndGetPayloadForUserCollectionMutation(false)
})


// Mark Insight useless in Collection
export const MarkInsightUselessInCollectionMutation = mutationWithClientMutationId({
  name: 'MarkInsightUselessInCollectionMutation',

  inputFields: {
    ...UserCollectionMutationsInputFields,
  },

  outputFields: {
    ...UserCollectionMutationsOutputFields,
  },

  mutateAndGetPayload: mutateAndGetPayloadForUserCollectionMutation(true)
})


// Mark Insight useful in Collection
export const MarkInsightUsefulInCollectionMutation = mutationWithClientMutationId({
  name: 'MarkInsightUsefulInCollectionMutation',

  inputFields: {
    ...UserCollectionMutationsInputFields,
  },

  outputFields: {
    ...UserCollectionMutationsOutputFields,
  },

  mutateAndGetPayload: mutateAndGetPayloadForUserCollectionMutation(false)
})
