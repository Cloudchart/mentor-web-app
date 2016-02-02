import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'

import AdminThemesConnection from '../../connections/admin/AdminThemesConnection'

export default new GraphQLObjectType({

  name: 'AdminInsight',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('AdminInsight'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    themes: AdminThemesConnection,

    createdAt: {
      type: GraphQLString,
      resolve: insight => insight.created_at
    },

  })

})
