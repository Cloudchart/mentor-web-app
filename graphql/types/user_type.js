import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'

import {
  connectionFromRecordsSlice
} from '../connections/recordsconnection'

import {
  ThemeStorage,
  UserThemeStorage,
} from '../../storage'


import UserThemeInsightStorage from '../../storage/NewUserThemeInsightStorage'


let UserType = new GraphQLObjectType({

  name: 'User',

  fields: () => ({

    id: {
      type: GraphQLID
    },

    name: {
      type: GraphQLString
    },

    isActive: {
      type:     GraphQLBoolean,
      resolve:  user => user.is_active
    },

    themes: {
      type: UserThemesConnection.connectionType,
      args: {
        includeRejected: {
          type: GraphQLBoolean,
          defaultValue: false
        },
        onlyDefault: {
          type: GraphQLBoolean,
          defaultValue: false
        },
        ...connectionArgs
      },
      resolve: async (user, args) => {
        let userThemes    = await UserThemeStorage.loadAll(user.id)
        let systemThemes  = await ThemeStorage.loadAllSystem()

        let defaultThemesIDs  = systemThemes
          .filter(theme => theme.is_default)
          .map(theme => theme.id)

        let rejectedUserThemesIDs = userThemes
          .filter(userTheme => userTheme.status === 'rejected')
          .map(userTheme => userTheme.theme_id)

        let userThemesIDs = userThemes.map(userTheme => userTheme.theme_id)

        let unrelatedSystemThemes = systemThemes
          .filter(theme => userThemesIDs.indexOf(theme.id) < 0)
          .map(theme => ({ user_id: user.id, theme_id: theme.id }))

        userThemes = userThemes.concat(unrelatedSystemThemes)

        if (args.onlyDefault)
          userThemes = userThemes
            .filter(userTheme => defaultThemesIDs.indexOf(userTheme.theme_id) > -1)

        if (!args.includeRejected)
          userThemes = userThemes
            .filter(userTheme => userTheme.status !== 'rejected')

        return connectionFromArray(userThemes, args)
      }
    },

    theme: {
      type: UserThemeType,
      args: {
        themeID: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (user, { themeID }) => UserThemeStorage.load(user.id, themeID)
    },

    insights: {
      type: UserInsightsConnection.connectionType,
      args: {
        ...connectionArgs
      },
      resolve: async (user, args) => {
        let records = await UserThemeInsightStorage.loadAllPositiveRatedForUser(user.id)
        return connectionFromRecordsSlice(records, args, { sliceStart: 0, recordsLength: records.length })
      }
    },

    subscribedThemes: {
      type: UserThemesConnection.connectionType,
      args: connectionArgs,
      resolve: async (user, args) => {
        let ids         = await UserThemeStorage.subscribedThemeIDsForUser(user.id)
        let userThemes  = await UserThemeStorage.loadManyForUser(user.id, ids)
        return connectionFromArray(userThemes, args)
      }
    },

    defaultThemes: {
      type: UserThemesConnection.connectionType,
      args: connectionArgs,
      resolve: async (user, args) => {
        let ids     = await ThemesStorage.defaultIDs()
        let themes  = await UserThemeStorage.loadManyForUser(user.id, ids)

        themes = themes.map((theme, index) => theme ? theme : { user_id: user.id, theme_id: ids[index] })

        return connectionFromArray(themes, args)
      }
    },

  })

})

export default UserType

import UserThemeType from './UserThemeType'
import UserThemesConnection from '../connections/user_themes_connection'
import UserInsightsConnection from '../connections/UserInsightsConnection'
