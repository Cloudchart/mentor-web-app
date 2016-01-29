import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
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


const adminUsersConnectionArgs = {
  ...connectionArgs,
  query: {
    type: GraphQLString,
  }
}

const adminUsersConnection = connectionDefinitions({
  name: 'AdminUsers',
  nodeType: AdminUserType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})

async function adminUsersConnectionResolve(_, args) {
  let adminUsers

  if (args.query) {
    adminUsers = await AdminUserStorage.loadAll('search', { query: args.query })
  } else {
    adminUsers = await AdminUserStorage.loadAll('regular')
  }

  return Object.assign(connectionFromArray(adminUsers, args), { count: adminUsers.length })
}

export default {
  type: adminUsersConnection.connectionType,
  args: adminUsersConnectionArgs,
  resolve: adminUsersConnectionResolve
}
