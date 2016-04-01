import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from '../arrayconnection'

import {
  TopicStorage
} from '../../../storage'

import TopicType from '../../types/TopicType'


const Connection = connectionDefinitions({
  name: 'AdminTopics',

  nodeType: TopicType
})

export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType

export default {
  type: Connection.connectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (user, { filter, ...args }, { rootValue: { viewer } }) => {
    let topics = await TopicStorage.loadAll('all')
    return {
      ...connectionFromArray(topics, args),
    }
  }
}
