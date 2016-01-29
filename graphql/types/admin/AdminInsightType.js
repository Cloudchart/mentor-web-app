import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'

import AdminInsightThemeConnection from '../../connections/admin/AdminInsightThemesConnection'

export default new GraphQLObjectType({

  name: 'AdminInsight',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('AdminInsight'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    themes: AdminInsightThemeConnection,

    createdAt: {
      type: GraphQLString,
      resolve: insight => insight.created_at
    },

  })

})
