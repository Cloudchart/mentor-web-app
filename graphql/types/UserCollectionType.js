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

import UserCollectionInsightsConnection from '../connections/UserCollectionInsightsConnection'


export default new GraphQLObjectType({

  name: 'UserCollection',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'UserCollection',

  fields: () => ({

    id: globalIdField('UserCollection'),

    name: {
      type: new GraphQLNonNull(GraphQLString),
    },

    insights: UserCollectionInsightsConnection

  })

})
