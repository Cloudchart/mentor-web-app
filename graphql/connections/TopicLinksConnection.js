import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'

import {
  TopicLinkStorage,
} from '../../storage'


import TopicLinkType from '../types/TopicLinkType'


export const Connection = connectionDefinitions({
  name: 'TopicLinks',

  nodeType: TopicLinkType,
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (topic, { ...args }, { rootValue: { viewer } }) => {
    let topicLinks = await TopicLinkStorage.loadAll('forTopic', { topic_id: topic.id })
    return {
      ...connectionFromArray(topicLinks, args),
      topic:  topic,
      user:   viewer,
    }
  }
}
