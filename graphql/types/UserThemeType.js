import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'

import {
  ThemesStorage,
  UserThemeInsightStorage
} from '../../storage'


let UserThemeType = new GraphQLObjectType({

  name: 'UserTheme',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ user_id, theme_id }) => `${user_id}:${theme_id}`
    },

    status: {
      type: GraphQLString
    },

    theme: {
      type: ThemeType,
      resolve: ({ theme_id, user_id }, _, { rootValue: { viewer }}) =>
        viewer.id === user_id ? ThemesStorage.load(theme_id) : new Error('Not authorized')
    },

    insights: {
      type: UserThemeInsightsConnection.connectionType,
      args: {
        includeRated: {
          type: GraphQLBoolean,
          defaultValue: false
        }, ...connectionArgs
      },
      resolve: async ({ theme_id, user_id }, args) => {
        let userThemeInsights = await UserThemeInsightStorage.allForUserTheme(user_id, theme_id)

        if (args.includeRated !== true)
          userThemeInsights = userThemeInsights.filter(record => !record.rate)

        return connectionFromArray(userThemeInsights, args)
      }
    }

  })

})

export default UserThemeType

import ThemeType from './theme_type'
import UserThemeInsightsConnection from '../connections/UserThemeInsightsConnection'
