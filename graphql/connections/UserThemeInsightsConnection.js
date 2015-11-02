import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import {
  UserThemeInsightStorage
} from '../../storage'


export const UserThemeInsightsConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserThemeInsightsFilterEnum',

  values: {
    RATED:    { value: 'rated'    },
    UNRATED:  { value: 'unrated'  },
    POSITIVE: { value: 'positive' },
    NEGATIVE: { value: 'negative' }
  }
})


export const UserThemeInsightsConnectionArgs = {
  ...connectionArgs,
  themeId: {
    type: GraphQLID
  },
  userId: {
    type: GraphQLID
  },
  filter: {
    type: UserThemeInsightsConnectionFilterEnum,
    defaultValue: 'unrated'
  }
}


export async function UserThemeInsightsConnectionResolve(root, args, { rootValue: { viewer } }) {
  let themeId = args.themeId ? fromGlobalId(args.themeId).id : root.__type == 'Theme' ? root.id : null
  let userId = args.userId ? fromGlobalId(args.userId).id : root.__type == 'User' ? root.id : viewer.id

  if (userId !== viewer.id)
    return new Error('Not authorized')

  let query = args.filter + (themeId ? 'forTheme' : '')
  let insights = await UserThemeInsightStorage.loadAll(query, { userID: userId, themeID: themeId })

  return connectionFromArray(insights, args)
}


export const UserThemeInsightsConnection = connectionDefinitions({

  name: 'UserThemeInsights',

  nodeType: UserThemeInsightType,

  connectionFields: {
    ratedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => 0
    },

    unratedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => 0
    }
  }

})


export const Field = {
  type:     UserThemeInsightsConnection.connectionType,
  args:     UserThemeInsightsConnectionArgs,
  resolve:  UserThemeInsightsConnectionResolve
}


import UserThemeInsightType from '../types/UserThemeInsightType'
