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
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    status: {
      type: new GraphQLNonNull(GraphQLUserThemeStatusEnum)
    }
  },

  outputFields: {
    theme: {
      type: new GraphQLNonNull(ThemeType)
    },
    viewer: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ id, status }, { rootValue: { viewer } }) => {
    let theme     = await ThemeStorage.load(fromGlobalId(id).id)
    let userTheme = await UserThemeStorage.forUser(viewer.id).load(theme.id).catch(error => null)

    userTheme
      ? await UserThemeStorage.update(userTheme.id, { status })
      : await UserThemeStorage.create({ user_id: viewer.id, theme_id: theme.id, status })

    await UserThemeStorage.forUser(viewer.id).clear(theme.id)

    return { theme, viewer }
  }


})

import UserType from '../types/UserType'
import ThemeType from '../types/ThemeType'
