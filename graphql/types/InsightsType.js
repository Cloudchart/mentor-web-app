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

import {
  InsightOriginStorage,
} from '../../storage'

import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'Insight',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Insight'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    origin: {
      type: InsightOriginType,
      resolve: ({ id }) => InsightOriginStorage.load(id).catch(() => null)
    }

  })

})


import InsightOriginType from './InsightOriginType'
