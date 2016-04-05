import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from '../arrayconnection'

import {
  UserStorage
} from '../../../storage'

import UserType from '../../types/UserType'


const Connection = connectionDefinitions({
  name: 'AdminUsers',

  nodeType: UserType
})

export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType

export default {
  type: Connection.connectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (user, { ...args }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let users = await UserStorage.loadAll('named')

    return {
      ...connectionFromArray(users, args),
    }
  }
}
