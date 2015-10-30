import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'UserTheme',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('UserTheme'),

    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ theme_id }) => ThemeStorage.load(theme_id).then(theme => theme.name)
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }) => `/themes/${id}`
    },

    isSubscribed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ status }) => status === 'subscribed'
    },

    isRejected: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ status }) => status === 'rejected'
    }

  })

})

import ThemeStorage from '../../storage/ThemeStorage'
