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

import SynchronizeThemeInsightsJob from '../../workers/jobs/SynchronizeThemeInsightsJob'


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
    type: UserThemeInsightsConnectionFilterEnum
  }
}


export async function UserThemeInsightsConnectionResolve(root, args, { rootValue: { viewer } }) {
  let themeID = args.themeId ? fromGlobalId(args.themeId).id : root.__type === 'Theme' ? root.id : null
  let userID = args.userId ? fromGlobalId(args.userId).id : root.__type === 'User' ? root.id : viewer.id
  let filter = args.filter ? args.filter : root.__type === 'User' ? 'positive' : 'unrated'

  if (userID !== viewer.id)
    return new Error('Not authorized')

  if (themeID)
    await SynchronizeThemeInsightsJob.perform({ themeID })

  let query = filter + (themeID ? 'ForTheme' : '')
  let insights = await UserThemeInsightStorage.loadAll(query, { userID, themeID })

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