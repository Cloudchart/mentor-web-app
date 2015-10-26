import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  ThemeStorage,
  UserThemeStorage
} from '../../storage'

import {
  UserType,
  UserThemeType
} from '../types'

import ActializeThemeInsights from '../../workers/jobs/ActualizeThemeInsights'


export default mutationWithClientMutationId({

  name: 'CreateThemeMutation',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
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

  mutateAndGetPayload: async ({ name }, { rootValue: { viewer }}) => {
    name = name.toLowerCase()

    let theme       = await ThemeStorage.loadOrCreateByName(name)
    let userTheme   = await UserThemeStorage.loadOrCreate(viewer.id, theme.id)

    if (userTheme.status !== 'subscribed')
      await UserThemeStorage.update(viewer.id, theme.id, { status: 'visible' })

    await ActializeThemeInsights.performAsync({ themeID: theme.id })

    return { theme: userTheme, viewer }
  }

})
