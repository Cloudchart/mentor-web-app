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
  UserThemeStorage
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

    themes: UserThemesConnectionField,

    theme: {
      type: new GraphQLNonNull(UserThemeType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: async (user, { id }) => {
        id = fromGlobalId(id).id

        let theme = await ThemeStorage.load(id)
        let userTheme = await UserThemeStorage.loadOne('unique', { userID: user.id, themeID: theme.id })

        // Set theme visibility status
        if (userTheme.status === 'available' || userTheme.status === 'rejected')
          userTheme = await UserThemeStorage.update(id, { status: 'visible' })

        return userTheme
      }
    },

    insights: UserThemeInsightsConnectionField

  })

})

import UserThemeType from './UserThemeType'
