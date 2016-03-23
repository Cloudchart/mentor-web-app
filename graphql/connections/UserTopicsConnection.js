import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'

import {
  TopicStorage
} from '../../storage'

import TopicType from '../types/TopicType'



export const UserTopicsConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserTopicsConnectionFilter',

  values: {
    ALL:        { value: 'all'        },
    DEFAULT:    { value: 'default'    },
    SUBSCRIBED: { value: 'subscribed' },
  }
})


const UserTopicsConnection = connectionDefinitions({
  name: 'UserTopicsConnection',

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },

  nodeType: TopicType
})

export const UserTopicsEdgeType = UserTopicsConnection.edgeType
export const UserTopicsConnectionType = UserTopicsConnection.connectionType

export default {
  type: UserTopicsConnection.connectionType,

  args: {
    ...connectionArgs,
    filter: {
      type: UserTopicsConnectionFilterEnum,
      defaultValue: 'all',
    }
  },

  resolve: async (user, { filter, ...args }, { rootValue: { viewer } }) => {
    let topics = await TopicStorage.loadAll(filter, { userID: viewer.id })
    return {
      ...connectionFromArray(topics, args),
      count: 0
    }
  }
}
