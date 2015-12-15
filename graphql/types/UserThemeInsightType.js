import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import {
  UserStorage,
  ThemeStorage,
  InsightStorage,
  InsightOriginStorage,
} from '../../storage'

import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'UserThemeInsight',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('UserThemeInsight'),

    content: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async ({ theme_id, insight_id }) => {
        let theme = await ThemeStorage.load(theme_id)
        let insight = await InsightStorage.load(insight_id)
        return `${theme.name} - ${insight.content}`
      }
    },

    origin: {
      type: InsightOriginType,
      resolve: ({ insight_id }) => InsightOriginStorage.load(insight_id).catch(() => null)
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ insight_id }) => `/insights/${insight_id}`
    },

    user: {
      type: new GraphQLNonNull(UserType),
      resolve: ({ user_id }) =>
        UserStorage
          .load(User_id)
    },

    theme: {
      type: new GraphQLNonNull(ThemeType),
      resolve: ({ theme_id }) =>
        ThemeStorage
          .load(theme_id)
    },

    rate: {
      type: GraphQLInt
    },

    ratedAt: {
      type: GraphQLString,
      resolve: ({ rate, updated_at }) =>
        rate
          ? updated_at
          : null
    }

  })

})


import UserType from './UserType'
import ThemeType from './ThemeType'
import InsightOriginType from './InsightOriginType'
