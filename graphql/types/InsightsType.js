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


export default new GraphQLObjectType({

  name: 'Insight',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Insight'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })

})
