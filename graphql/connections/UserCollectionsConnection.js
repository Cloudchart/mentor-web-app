import {
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
  UserCollectionStorage
} from '../../storage'


import UserCollectionType from '../types/UserCollectionType'


const UserCollectionsConnection = connectionDefinitions({
  name: 'UserCollectionsConnection',

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },

  nodeType: UserCollectionType
})


export const UserCollectionsEdgeType = UserCollectionsConnection.edgeType
export const UserCollectionsConnectionType = UserCollectionsConnection.connectionType


export default {
  type: UserCollectionsConnection.connectionType,

  args: {
    ...connectionArgs
  },

  resolve: async (user, args, { rootValue: { viewer } }) => {
    let userCollections = await UserCollectionStorage.loadAll('user', { userID: user.id })
    return {
      ...connectionFromArray(userCollections, args),
      count: userCollections.length
    }
  }
}
