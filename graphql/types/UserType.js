import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  fromGlobalId,
  globalIdField
} from 'graphql-relay'

import {
  ThemeStorage,
  UserThemeStorage,
  DeviceStorage,
  UserNotificationsSettingsStorage
} from '../../storage'

import { nodeInterface } from './Node'
import { field as UserThemesConnectionField } from '../connections/UserThemesConnection'
import { Field as UserThemeInsightsConnectionField } from '../connections/UserThemeInsightsConnection'


export default new GraphQLObjectType({

  name: 'User',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('User'),

    name: {
      type: GraphQLString
    },

    isActive: {
      type:     GraphQLBoolean,
      resolve:  user => user.is_active
    },

    pushToken: {
      type: GraphQLString,
      resolve: (user) =>
        DeviceStorage.loadOne('user', { userID: user.id }).then(({ push_token }) => push_token).catch(e => null)
    },

    themes: UserThemesConnectionField,

    theme: {
      type: new GraphQLNonNull(UserThemeType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: async (user, { id }, { rootValue: { viewer } }) => {
        id = fromGlobalId(id).id

        let userTheme = await UserThemeStorage.load(id)

        // Check if theme belongs to user
        if (userTheme.user_id !== viewer.id)
          return new Error('Not authorized')

        // Set theme visibility status
        if (userTheme.status === 'available' || userTheme.status === 'rejected')
          userTheme = await UserThemeStorage.update(userTheme.id, { status: 'visible' })

        return userTheme
      }
    },

    insights: UserThemeInsightsConnectionField,

    questionnaire: {
      type: UserQuestionnaireType,
      resolve: (user) => user
    },

    notificationSettings: {
      type: UserNotificationsSettingsType,
      resolve: (user) => UserNotificationsSettingsStorage.load(user.id).catch(error => null)
    }

  })

})

import UserThemeType from './UserThemeType'
import UserQuestionnaireType from './UserQuestionnaireType'
import UserNotificationsSettingsType from './UserNotificationsSettingsType'
