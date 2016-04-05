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
  RoleStorage,
} from '../../storage'

import RoleType from '../types/RoleType'


export const Connection = connectionDefinitions({
  name: 'UserRoles',

  nodeType: RoleType,
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (user, { ...args }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let roles = await RoleStorage.loadAll('forUser', { user_id: user.id })

    return {
      ...connectionFromArray(roles, args),
      user,
    }
  }
}
