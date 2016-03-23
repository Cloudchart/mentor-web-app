import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  toGlobalId,
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

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
  async ({ insightID, topicID }, { rootValue: { viewer } }) => {

  }


let mutateAndGetPayloadForUserCollectionMutation = (is_useless) =>
  async ({ insightID, collectionID }, { rootValue: { viewer } }) => {

  }

// Like Insight in Topic
//
export const LikeInsightInTopicMutation = mutationWithClientMutationId({
  name: 'LikeInsightInTopicMutation',

  inputFields: {
    ...TopicMutationsInputFields,
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
