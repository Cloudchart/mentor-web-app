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

    isActive: {
      type:     GraphQLBoolean,
      resolve:  user => user.is_active
    },

    pushToken: {
      type: GraphQLString,
      resolve: (user) =>
        DeviceStorage.loadOne('user', { userID: user.id }).then(({ push_token }) => push_token).catch(e => null)
    },

  })

})
