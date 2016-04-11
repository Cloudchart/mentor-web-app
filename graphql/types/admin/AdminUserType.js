import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import {
  AuthTokenStorage,
} from '../../../storage'

import { nodeInterface } from '../Node'


export default new GraphQLObjectType({

  name: 'AdminUser',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'AdminUser',

  fields: () => ({

    id: globalIdField('AdminUser'),

    name: {
      type: GraphQLString
    },

    email: {
      type: GraphQLString
    },

    isActive: {
      type: GraphQLBoolean,
      resolve: user => user.is_active
    },

    authProvider: {
      type: GraphQLString,
      resolve: (user) =>
        AuthTokenStorage.loadOne('byUser', { userID: user.id }).then(({ provider_name }) => provider_name).catch(e => null)
    },

    createdAt: {
      type: GraphQLString,
      resolve: user => user.created_at
    },

  })

})
