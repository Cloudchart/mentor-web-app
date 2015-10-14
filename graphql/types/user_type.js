import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'


let UserType = new GraphQLObjectType({

  name: 'User',

  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    is_active: {
      type: GraphQLBoolean
    },

    themes: {
      type: ThemesConnection,
      args: connectionArgs,
      resolve: async (user, args) =>
        connectionFromArray(await user.getThemes({ order: 'name' }), args)
    },

    insights: {
      type: new GraphQLList(InsightType),
      args: {
        themeID: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (user, { themeID }) => user.insightsForTheme(themeID)
    },

    favoriteInsights: {
      type: InsightsConnection,
      args: connectionArgs,
      resolve: async (user, args) => {
        let insights = await user.favoriteInsights()
        return connectionFromArray(insights, args)
      }
    },

    defaultThemes: {
      type: new GraphQLList(ThemeType),
      resolve: () => Theme.findAll({ where: { is_default: true }})
    }
  })

})

export default UserType

import { Theme, Insight } from '../../models'
import ThemeType from './theme_type'
import InsightType from './insight_type'
import { connectionType as ThemesConnection } from '../connections/users_themes_connection'
import { connectionType as InsightsConnection } from '../connections/user_insights_connection'
