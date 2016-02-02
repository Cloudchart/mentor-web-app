import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'

import AdminUsersConnection from '../../connections/admin/AdminUsersConnection'
import AdminInsightsConnection from '../../connections/admin/AdminInsightsConnection'
import AdminThemesConnection from '../../connections/admin/AdminThemesConnection'


export default new GraphQLObjectType({

  name: 'Admin',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Admin'),

    name: {
      type: GraphQLString
    },

    users: AdminUsersConnection,
    insights: AdminInsightsConnection,
    themes: AdminThemesConnection,

  })
})
