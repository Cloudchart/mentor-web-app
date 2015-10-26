import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserThemeStorage
} from '../../storage'

import {
  UserType,
  UserThemeType
} from '../types'


export default mutationWithClientMutationId({

  name: 'CreateThemeMutation',

  inputFields: {
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    theme: {
      type: new GraphQLNonNull(UserThemeType)
    },
    viewer: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ themeID }, { rootValue: { viewer }}) => {
    let userTheme   = await UserThemeStorage.loadOrCreate(viewer.id, themeID)

    await UserThemeStorage.update(viewer.id, theme.id, { status: 'rejected' })

    return { theme: userTheme, viewer }
  }

})
