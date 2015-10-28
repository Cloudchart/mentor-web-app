import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId,
  cursorForObjectInConnection
} from 'graphql-relay'

import {
  UserThemeStorage
} from '../../storage'

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
    let [userID, themeID] = id.split(':')

    if (userID !== viewer.id)
      return new Error('Not authorized')

    let userTheme = await UserThemeStorage.load(userID, themeID)

    if (userTheme)
      await UserThemeStorage.update(userID, themeID, { status: status })
    else
      await UserThemeStorage.create(userID, themeID, { status: status })

    userTheme = await UserThemeStorage.load(userID, themeID)

    return { userTheme }
  }

})

import UserThemeType from '../types/UserThemeType'
import UserThemesConnection from '../connections/user_themes_connection'
