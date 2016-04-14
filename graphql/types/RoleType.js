import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'Role',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'Role',

  fields: () => ({

    id: globalIdField('Role'),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })
})
