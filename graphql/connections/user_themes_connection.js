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
      resolve: ({ node }, _, { rootValue: { viewer } }) =>
        UserThemeStorage.load(viewer.id, node.theme_id)
          .then(record => record.status)
          .catch(error => null)
    }
  }

})
