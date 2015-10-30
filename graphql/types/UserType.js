import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import { nodeInterface } from './Node'
import { field as UserThemesConnectionField } from '../connections/UserThemesConnection'

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

    themes: UserThemesConnectionField

  })

})
