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

import {
  TopicStorage,
  UserThemeStorage,
} from '../../storage'

import TopicType from '../types/TopicType'

import {
  UserTopicsEdgeType
} from '../connections/UserTopicsConnection'

import {
  nodeToEdge
} from '../connections/arrayconnection'


const MutationInputFields = {
  topicID: {
    type: new GraphQLNonNull(GraphQLID)
  }
}

const MutationOutputFields = {
  topic: {
    type: new GraphQLNonNull(TopicType)
  },

  topicID: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: ({ topic }) => toGlobalId('Topic', topic.id)
  },

  topicEdge: {
    type: UserTopicsEdgeType,
    resolve: ({ topic }) => nodeToEdge(topic)
  }
}


export const SubscribedTopicsCap = 3

export const SubscribeOnTopicMutation = mutationWithClientMutationId({
  name: 'SubscribeOnTopicMutation',

  inputFields: {
    ...MutationInputFields,
  },

  outputFields: {
    ...MutationOutputFields,
  },

  mutateAndGetPayload: async ({ topicID }, { rootValue: { viewer } }) => {
    let topic = await TopicStorage.load(fromGlobalId(topicID).id)
    let subscribedTopics = await TopicStorage.loadAll('subscribed', { userID: viewer.id })
    let link = await UserThemeStorage.loadOne('unique', { userID: viewer.id, themeID: topic.id }).catch(error => null)

    if (!link)
      link = subscribedTopics.length < SubscribedTopicsCap
        ? await UserThemeStorage.create({ user_id: viewer.id, theme_id: topic.id, status: 'subscribed '})
        : link

    if (link.status !== 'subscribed' && subscribedTopics.length < SubscribedTopicsCap)
      link = subscribedTopics.length < SubscribedTopicsCap
        ? await UserThemeStorage.update(link.id, { status: 'subscribed' })
        : link

    if (!link || link.status !== 'subscribed')
      return new Error('Subscribed topics cap reached.')

    return { topic }
  }
})


export const UnsubscribeFromTopicMutation = mutationWithClientMutationId({
  name: 'UnsubscribeFromTopicMutation',

  inputFields: {
    ...MutationInputFields,
  },

  outputFields: {
    ...MutationOutputFields,
  },

  mutateAndGetPayload: async ({ topicID }, { rootValue: { viewer } }) => {
    let topic = await TopicStorage.load(fromGlobalId(topicID).id)
    let subscribedTopics = await TopicStorage.loadAll('subscribed', { userID: viewer.id })
    let link = await UserThemeStorage.loadOne('unique', { userID: viewer.id, themeID: topic.id }).catch(error => null)

    if (link && link.status === 'subscribed')
      await UserThemeStorage.update(link.id, { status: 'available' })

    return { topic }
  }
})
