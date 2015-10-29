import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId,
  cursorForObjectInConnection
} from 'graphql-relay'

import NewThemeStorage from '../../storage/NewThemeStorage'
import NewUserThemeStorage from '../../storage/NewUserThemeStorage'

export default mutationWithClientMutationId({

  name: 'UserThemeMutation',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    status: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    userTheme: {
      type: new GraphQLNonNull(UserThemeType)
    }
  },

  mutateAndGetPayload: async ({ id, status }, { rootValue: { viewer } }) => {
    let theme     = await NewThemeStorage.load(id)

    let userTheme = await NewUserThemeStorage
      .loadOne('userAndTheme', { userID: viewer.id, themeID: theme.id })
      .catch(error => null )

    userTheme = userTheme
      ? await NewUserThemeStorage.update(userTheme.id, { status })
      : await NewUserThemeStorage.create({ status, user_id: viewer.id, theme_id: theme.id })

    return { userTheme }
  }

})

import UserThemeType from '../types/UserThemeType'
import UserThemesConnection from '../connections/user_themes_connection'
