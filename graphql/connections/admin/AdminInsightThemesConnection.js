import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  AdminThemeStorage
} from '../../../storage'

import {
  connectionFromArray
} from '../arrayconnection'

import ThemeType from '../../types/ThemeType'


const adminInsightThemesConnection = connectionDefinitions({
  name: 'AdminInsightThemes',
  nodeType: ThemeType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})

async function adminInsightThemesConnectionResolve(insight, args) {
  let adminInsights = await AdminThemeStorage.loadAll('byInsight', { insightID: insight.id })
  return Object.assign(connectionFromArray(adminInsights, args), { count: adminInsights.length })
}

export default {
  type: adminInsightThemesConnection.connectionType,
  args: connectionArgs,
  resolve: adminInsightThemesConnectionResolve
}
