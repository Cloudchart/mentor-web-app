import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  toGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  UserStorage,
  RoleStorage,
} from '../../storage'

import UserType from '../types/UserType'
import RoleType from '../types/RoleType'


export default mutationWithClientMutationId({

  name: 'RevokeRoleFromUser',

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

    roleID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ role }) => toGlobalId('Role', role.id)
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
      return new Error('Role not found')

    if (role.name === 'admin' && viewer.id === user.id)
      return new Error('Cannot revoke admin role from self.')

    await RoleStorage.destroy(role.id)

    return { role, user }
  }

})
