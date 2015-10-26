import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionDefinitions
} from 'graphql-relay'

import {
  UserThemeStorage
} from '../../storage'

import ThemeType from '../types/theme_type'
import UserThemeType from '../types/UserThemeType'

export default connectionDefinitions({

  name: 'UsersThemes',

  nodeType: UserThemeType,

  edgeFields: {
    status: {
      type: GraphQLString,
      resolve: async ({ node }, _, { rootValue: { viewer } }) => {
        try {
          let userTheme = await UserThemeStorage.load(viewer.id, node.theme_id)
          return userTheme.status
        } catch(e) {
          return null
        }
      }
    }
  }

})
