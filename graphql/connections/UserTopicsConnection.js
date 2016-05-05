import {
  GraphQLID,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
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

import SynchronizeUserThemesJob from '../../workers/jobs/SynchronizeUserThemesJob'


export const SubscribedTopcsCap = 3


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
    availableSlotsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ user }) => {
        let subscribedTopicsCount = await TopicStorage.count('subscribed', { userID: user.id })
        return SubscribedTopcsCap - subscribedTopicsCount
      }
    }
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
    await SynchronizeUserThemesJob.perform({ userID: viewer.id })

    let topics = await TopicStorage.loadAll(filter, { userID: viewer.id })

    return {
      ...connectionFromArray(topics, args),
      count: topics.length,
      user,
    }
  }
}
