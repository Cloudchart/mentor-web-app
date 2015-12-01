import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'

import {
  ThemeInsightStorage,
  UserThemeInsightStorage
} from '../../storage'

import SynchronizeThemeInsightsJob from '../../workers/jobs/SynchronizeThemeInsightsJob'
import SynchronizeUserThemeInsightsJob from '../../workers/jobs/SynchronizeUserThemeInsightsJob'


export const UserThemeInsightsConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserThemeInsightsFilterEnum',

  values: {
    RATED:      { value: 'rated'    },
    UNRATED:    { value: 'unrated'  },
    POSITIVE:   { value: 'positive' },
    LIKED:      { value: 'liked'    },
    USEFUL:     { value: 'useful'   },
    NEGATIVE:   { value: 'negative' },
    DISLIKED:   { value: 'disliked' },
    USELESS:    { value: 'useless'  },
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
  let themeID = args.themeId ? fromGlobalId(args.themeId).id : root.__type === 'UserTheme' ? root.theme_id : null
  let userID = args.userId ? fromGlobalId(args.userId).id : root.__type === 'User' ? root.id : viewer.id
  let filter = args.filter ? args.filter : root.__type === 'User' ? 'positive' : 'unrated'

  if (userID !== viewer.id)
    return new Error('Not authorized')

  if (themeID) {
    await SynchronizeThemeInsightsJob.perform({ themeID })
    await SynchronizeUserThemeInsightsJob.perform({ userID, themeID })
  }

  let insights = await UserThemeInsightStorage.loadAll(filter + (themeID ? 'ForTheme' : ''), { userID, themeID })

  return Object.assign(connectionFromArray(insights, args), { userID, themeID })
}


export const UserThemeInsightsConnection = connectionDefinitions({

  name: 'UserThemeInsights',

  nodeType: UserThemeInsightType,

  connectionFields: {
    totalCount: {
      type: GraphQLInt,
      resolve: ({ themeID }) => themeID ? ThemeInsightStorage.count('allForTheme', { themeID }) : null
    },


    ratedCount: {
      type: GraphQLInt,
      resolve: ({ userID, themeID }) => themeID ? UserThemeInsightStorage.count("ratedForTheme", { userID, themeID }) : null
    },

    unratedCount: {
      type: GraphQLInt,
      resolve: ({ userID, themeID }) =>  themeID ? UserThemeInsightStorage.count("unratedForTheme", { userID, themeID }) : null
    }
  }

})


export const Field = {
  type:     UserThemeInsightsConnection.connectionType,
  args:     UserThemeInsightsConnectionArgs,
  resolve:  UserThemeInsightsConnectionResolve
}


import UserThemeInsightType from '../types/UserThemeInsightType'
