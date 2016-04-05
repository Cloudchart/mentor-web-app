import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import UserType from '../types/UserType'
import RoleType from '../types/RoleType'

import {
  EdgeType
} from '../connections/UserRoles'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  UserStorage,
  RoleStorage,
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'GrantRoleToUser',

  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    roleName: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    role: {
      type: new GraphQLNonNull(RoleType),
    },

    roleEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ role }) => nodeToEdge(role)
    },

    user: {
      type: new GraphQLNonNull(UserType),
    }
  },

  mutateAndGetPayload: async ({ userID, roleName }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let user = await UserStorage.load(fromGlobalId(userID).id).catch(() => null)
    if (!user)
      return new Error('User not found')

    let role = await RoleStorage.loadOne('namedForUser', { user_id: user.id, name: roleName }).catch(() => null)
    if (!role)
      role = await RoleStorage.create({ user_id: user.id, name: roleName.toLowerCase() })

    return { role, user }
  }

})
