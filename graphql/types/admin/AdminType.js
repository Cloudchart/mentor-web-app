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

import { Field as AdminThemesConnection } from '../../connections/admin/AdminThemesConnection'

import QuestionsConnection from '../../connections/Questions'
import UnchainedBotReactionsConnection from '../../connections/UnchainedBotReactions'

import AdminTopicsConnection from '../../connections/AdminTopics'
import AdminInsightsConnection from '../../connections/AdminInsights'


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
    themes: AdminThemesConnection,


    questions: QuestionsConnection,

    reactions: UnchainedBotReactionsConnection,

    insights: AdminInsightsConnection,
    topics: AdminTopicsConnection,
  })
})
