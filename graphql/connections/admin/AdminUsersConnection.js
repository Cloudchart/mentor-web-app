import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  AdminUserStorage
} from '../../../storage'

import {
  connectionFromArray
} from '../arrayconnection'

import AdminUserType from '../../types/admin/AdminUserType'


export const adminUsersConnection = connectionDefinitions({
  name: 'AdminUsers',
  nodeType: AdminUserType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})

export async function adminUsersConnectionResolve(_, args) {
  let adminUsers = await AdminUserStorage.loadAll('all')
  return Object.assign(connectionFromArray(adminUsers, args), { count: adminUsers.length })
}

export const field = {
  type: adminUsersConnection.connectionType,
  args: connectionArgs,
  resolve: adminUsersConnectionResolve
}
