import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'

import {
  ThemesStorage,
  UserThemeStorage
} from '../../storage'


let UserType = new GraphQLObjectType({

  name: 'User',

  fields: () => ({

    id: {
      type: GraphQLID
    },

    name: {
      type: GraphQLString
    },

    isActive: {
      type:     GraphQLBoolean,
      resolve:  user => user.is_active
    },

    themes: {
      type: UserThemesConnection.connectionType,
      args: connectionArgs,
      resolve: async (user, args) => {
        let ids         = await UserThemeStorage.themeIDsForUser(user.id)
        let userThemes  = await UserThemeStorage.loadManyForUser(user.id, ids)
        return connectionFromArray(userThemes, args)
      }
    },

    theme: {
      type: UserThemeType,
      args: {
        themeID: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (user, { themeID }) => UserThemeStorage.load(user.id, themeID)
    },

    subscribedThemes: {
      type: UserThemesConnection.connectionType,
      args: connectionArgs,
      resolve: async (user, args) => {
        let ids         = await UserThemeStorage.subscribedThemeIDsForUser(user.id)
        let userThemes  = await UserThemeStorage.loadManyForUser(user.id, ids)
        return connectionFromArray(userThemes, args)
      }
    },

    defaultThemes: {
      type: UserThemesConnection.connectionType,
      args: connectionArgs,
      resolve: async (user, args) => {
        let ids     = await ThemesStorage.defaultIDs()
        let themes  = await UserThemeStorage.loadManyForUser(user.id, ids)

        themes = themes.map((theme, index) => theme ? theme : { user_id: user.id, theme_id: ids[index] })

        return connectionFromArray(themes, args)
      }
    },

  })

})

export default UserType

import UserThemeType from './UserThemeType'
import UserThemesConnection from '../connections/user_themes_connection'
