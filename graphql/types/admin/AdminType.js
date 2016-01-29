import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'

import AdminUsersConnectionField from '../../connections/admin/AdminUsersConnection'
import AdminInsightsConnectionField from '../../connections/admin/AdminInsightsConnection'


export default new GraphQLObjectType({

  name: 'Admin',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Admin'),

    name: {
      type: GraphQLString
    },

    users: AdminUsersConnectionField,
    insights: AdminInsightsConnectionField,

  })
})
