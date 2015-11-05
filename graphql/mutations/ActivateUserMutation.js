import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'


import {
  UserStorage
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'ActivateUser',

  inputFields: {
    userId: {
      type: GraphQLID
    }
  },

  outputFields: {
    user: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ userId }, { rootValue: { viewer } }) => {
    userId  = userId ? fromGlobalId(userId).id : viewer.id

    if (userId !== viewer.id) return new Error('Not authorized')

    let user = await UserStorage.load(userId)
    await UserStorage.update(user.id, { is_active: true })

    return { user }
  }

})


import UserType from '../types/UserType'
