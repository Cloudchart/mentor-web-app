import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import { nodeInterface } from './Node'

import { ThemeStorage } from '../../storage'

import { Field as UserThemeInsightsConnectionField } from '../connections/UserThemeInsightsConnection'


export default new GraphQLObjectType({

  name: 'UserTheme',

  deprecationReason: "Moved to Topic type",

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'UserTheme',

  fields: () => ({

    id: globalIdField('UserTheme'),

    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ theme_id }) => ThemeStorage.load(theme_id).then(theme => theme.name)
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ theme_id }) => `/themes/${theme_id}`
    },

    isSubscribed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ status }) => status === 'subscribed'
    },

    subscribedAt: {
      type: GraphQLString,
      resolve: ({ status, updated_at }) => status === 'subscribed' ? updated_at : null
    },

    isRejected: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ status }) => status === 'rejected'
    },

    insights: UserThemeInsightsConnectionField

  })

})
