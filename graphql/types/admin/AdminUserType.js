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
  DeviceStorage,
  AuthTokenStorage,
} from '../../../storage'

import { nodeInterface } from '../Node'


export default new GraphQLObjectType({

  name: 'AdminUser',

  interfaces: [nodeInterface],

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
