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
  UserStorage,
  UserThemeStorage,
  UserThemeInsightStorage,
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'ResetUser',

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
    userId = userId ? fromGlobalId(userId).id : viewer.id
    let user = await UserStorage.load(userId)

    if (user.id !== viewer.id)
      return new Error('Not authorized')

    await UserThemeStorage.destroyAllForUser(user.id)
    await UserThemeInsightStorage.destroyAllForUser(user.id)
    user = await UserStorage.update(user.id, { is_active: false })

    return { user }
  }

})


import UserType from '../types/UserType'
