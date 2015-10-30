import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'


export const UserThemesConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserThemeFilterEnum',

  values: {
    DEFAULT:    { value: 'default'    },
    AVAILABLE:  { value: 'available'  },
    VISIBLE:    { value: 'visible'    },
    SUBSCRIBED: { value: 'subscribed' },
    REJECTED:   { value: 'rejected'   },
    RELATED:    { value: 'related'    },
    UNRELATED:  { value: 'unrelated'  },
  }
})


export const userThemesConnection = connectionDefinitions({
  name: 'UserThemes',
  nodeType: UserThemeType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },

    subscribedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ userID }) => UserThemeStorage.count('subscribed', { userID })
    }
  }
})


export const userThemesConnectionArgs = {
  ...connectionArgs,
  filter: {
    type: UserThemesConnectionFilterEnum,
    defaultValue: 'default'
  }
}


export async function userThemesConnectionResolve(user, args) {
  // Synchronize User Themes
  await SynchronizeUserThemeJobs.perform({ userID: user.id })

  // Load User Themes
  let userThemes = await UserThemeStorage.loadAll(args.filter, { userID: user.id })

  return Object.assign(connectionFromArray(userThemes, args), { count: userThemes.length, userID: user.id })
}


export const field = {
  type:     userThemesConnection.connectionType,
  args:     userThemesConnectionArgs,
  resolve:  userThemesConnectionResolve
}


import UserThemeType from '../types/UserThemeType'
import UserThemeStorage from '../../storage/UserThemeStorage'
import SynchronizeUserThemeJobs from '../../workers/jobs/SynchronizeUserThemesJob'
