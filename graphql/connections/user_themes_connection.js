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

import UserThemeType from '../types/UserThemeType'

export default connectionDefinitions({

  name: 'UsersThemes',

  nodeType: UserThemeType,

})
