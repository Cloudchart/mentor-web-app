import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'Admin',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('User'),

    name: {
      type: GraphQLString
    }

  })
})
