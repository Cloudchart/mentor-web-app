import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'


import UserStorage from '../../storage/UserStorage'
import UserThemeStorage from '../../storage/UserThemeStorage'


export const GraphQLUserThemeStatusEnum = new GraphQLEnumType({
  name: 'UserThemeStatusEnum',

  values: {
    AVAILABLE:  { value: 'available'  },
    VISIBLE:    { value: 'visible'    },
    REJECTED:   { value: 'rejected'   },
    SUBSCRIBED: { value: 'subscribed' },
  }
})


export default mutationWithClientMutationId({

  name: 'UpdateUserTheme',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    status: {
      type: new GraphQLNonNull(GraphQLUserThemeStatusEnum)
    },
    userId: {
      type: GraphQLID
    },
  },

  outputFields: {
    userTheme: {
      type: new GraphQLNonNull(UserThemeType)
    },
    user: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ id, userId, status }, { rootValue: { viewer } }) => {
    id      = fromGlobalId(id).id
    userId  = userId ? fromGlobalId(userId) : viewer.id

    let userTheme = await UserThemeStorage.load(id)

    if (userTheme.user_id !== userId)
      return new Error('Not authorized')

    let user = UserStorage.load(userId)

    userTheme = await UserThemeStorage.update(userTheme.id, { status: status })

    return { userTheme, user }
  }


})

import UserType from '../types/UserType'
import UserThemeType from '../types/UserThemeType'
