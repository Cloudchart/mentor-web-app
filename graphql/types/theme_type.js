import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'


let ThemeKind = new GraphQLEnumType({
  name: 'ThemeKind',

  values: {
    SYSTEM:   { value: 'is_system' },
    DEFAULT:  { value: 'is_default'}
  }
})


let ThemeType = new GraphQLObjectType({

  name: 'Theme',

  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    isSystem: {
      type: GraphQLBoolean
    },
    isDefault: {
      type: GraphQLBoolean
    },

    isSelectedByViewer: {
      type: GraphQLBoolean,
      resolve: async (theme, _, { rootValue: { viewer } }) =>
        (await theme.countUsers({ where: { id: viewer.id }})) == 1
    },

    insights: {
      type: InsightsConnection,
      args: connectionArgs,
      resolve: async (theme, args) =>
        connectionFromArray(await theme.getInsights(), args)
    },

    viewerInsights: {
      type: InsightsConnection,
      args: connectionArgs,
      resolve: async (theme, args, { rootValue: { viewer } }) =>
        connectionFromArray(await viewer.insightsByTheme(theme.id), args)
    }
  })

})

ThemeType.ThemeKind = ThemeKind

export default ThemeType

import { Insight } from '../../models'
import InsightType from './insight_type'
import { connectionType as InsightsConnection } from '../connections/themes_insights_connection'
