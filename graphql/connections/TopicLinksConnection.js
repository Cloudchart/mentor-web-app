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


export const TopicLinksFilter = new GraphQLEnumType({
  name: 'TopicLinkFilter',

  values: {
    ALL:      { value: 'all'          },
    READ:     { value: 'readByUser'   },
    UNREAD:   { value: 'unreadByUser' },
    DEFAULT:  { value: 'default'      },
  }
})

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
    filter: {
      type: TopicLinksFilter,
      defaultValue: 'default',
    }
  },

  resolve: async (topic, { filter, ...args }, { rootValue: { viewer } }) => {
    if (filter === 'default')
      filter = viewer.isAdmin ? 'all' : 'unreadByUser'

    if (filter === 'all' && !viewer.isAdmin)
      return new Error('Not authorized.')

    let topicLinks = await TopicLinkStorage.loadAll(filter + 'ForTopic', { topic_id: topic.id, user_id: viewer.id })

    return {
      ...connectionFromArray(topicLinks, args),
      topic:  topic,
      user:   viewer,
    }
  }
}
