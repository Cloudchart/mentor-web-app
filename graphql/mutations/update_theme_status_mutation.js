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
  ThemeStorage,
  UserThemeStorage
} from '../../storage'

import {
  UserType,
  ThemeType
} from '../types'

export default mutationWithClientMutationId({

  name: 'ThemeStatusMutation',

  inputFields: {
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    status: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    viewer: {
      type: new GraphQLNonNull(UserType),
      resolve: (args, _, { rootValue: { viewer }}) => viewer
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      resolve: ({ themeID }, _, { rootValue: { viewer }}) =>
        ThemeStorage.findOneForUser(viewer.id, themeID)
    },
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  mutateAndGetPayload: async ({ themeID, status }, { rootValue: { viewer }}) => {
    let userTheme = await UserThemeStorage.userLoader(viewer.id).load(themeID)
    if (userTheme) {
      await UserThemeStorage.update({ status: status }, { where: { id: userTheme.id } })
    } else {
      await UserThemeStorage.create({ user_id: viewer.id, theme_id: themeID, status: status })
    }
    return { themeID }
  }

})
