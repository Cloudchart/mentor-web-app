import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'


import ThemeStorage from '../../storage/ThemeStorage'
import UserThemeStorage from '../../storage/UserThemeStorage'


export const GraphQLUserThemeStatusEnum = new GraphQLEnumType({
  name: 'UserThemeStatusEnum',

  values: {
    SUBSCRIBED: { value: 'subscribed' },
    VISIBLE:    { value: 'visible'    },
    REJECTED:   { value: 'rejected'   }
  }
})


export default mutationWithClientMutationId({

  name: 'UpdateUserTheme',

  inputFields: {
    themeId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    userId: {
      type: GraphQLID
    },
    status: {
      type: new GraphQLNonNull(GraphQLUserThemeStatusEnum)
    }
  },

  outputFields: {
    theme: {
      type: new GraphQLNonNull(ThemeType)
    },
    user: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ themeId, userId, status }, { rootValue: { viewer } }) => {
    themeId = fromGlobalId(themeId).id
    userId  = userId ? fromGlobalId(userId).id : viewer.id

    if (userId !== viewer.id) return new Error('Not authorized')

    let user = viewer

    let theme     = await ThemeStorage.load(themeId)
    let userTheme = await UserThemeStorage.forUser(user.id).load(theme.id).catch(error => null)

    userTheme
      ? await UserThemeStorage.update(userTheme.id, { status })
      : await UserThemeStorage.create({ user_id: user.id, theme_id: theme.id, status })

    await UserThemeStorage.forUser(user.id).clear(theme.id)

    return { theme, user }
  }


})

import UserType from '../types/UserType'
import ThemeType from '../types/ThemeType'
