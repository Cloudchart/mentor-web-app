import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from '../Node'

import AdminUsersConnection from '../../connections/admin/AdminUsers'
import AdminInsightsConnection from '../../connections/admin/AdminInsightsConnection'
import { Field as AdminThemesConnection } from '../../connections/admin/AdminThemesConnection'
import AdminTopicsConnection from '../../connections/admin/AdminTopicsConnection'

import QuestionsConnection from '../../connections/Questions'
import UnchainedBotReactionsConnection from '../../connections/UnchainedBotReactions'


export default new GraphQLObjectType({

  name: 'Admin',

  interfaces: [nodeInterface],

  isTypeOf: (value) => value.__type === 'Admin',

  fields: () => ({

    id: globalIdField('Admin'),

    name: {
      type: GraphQLString
    },

    users: AdminUsersConnection,
    insights: AdminInsightsConnection,
    themes: AdminThemesConnection,

    topics: AdminTopicsConnection,

    questions: QuestionsConnection,

    reactions: UnchainedBotReactionsConnection,

  })
})
