import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  UserThemeStorage
} from '../../storage'

import {
  connectionFromArray
} from './arrayconnection'

import SynchronizeUserThemesJob from '../../workers/jobs/SynchronizeUserThemesJob'


export const UserThemesConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserThemeFilterEnum',

  values: {
    DEFAULT:    { value: 'default'    },
    SYSTEM:     { value: 'system'     },
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
    },

    subscriptionsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => 3
    },

    rejectedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ userID }) => UserThemeStorage.count('rejected', { userID })
    },
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
  await SynchronizeUserThemesJob.perform({ userID: user.id })

  // Load User Themes
  let userThemes = await UserThemeStorage.loadAll(args.filter, { userID: user.id })

  return Object.assign(connectionFromArray(userThemes, args), { userID: user.id, count: userThemes.length })
}


export const field = {
  type:     userThemesConnection.connectionType,
  args:     userThemesConnectionArgs,
  resolve:  userThemesConnectionResolve
}


import UserThemeType from '../types/UserThemeType'
