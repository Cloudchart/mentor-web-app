import {
  GraphQLInt,
  GraphQLString,
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
  InsightStorage
} from '../../storage'


import TopicType from '../types/TopicType'

export const Connection = connectionDefinitions({

  name: 'AdminTopics',

  nodeType: TopicType

})

export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType

export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
    find: {
      type: GraphQLString,
      defaultValue: '',
    },
  },

  resolve: async (root, { find, ...args }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let topics = await TopicStorage.loadAll('allForAdmin', { query: `%${find}%` })

    return {
      ...connectionFromArray(topics, args),
    }
  }
}
