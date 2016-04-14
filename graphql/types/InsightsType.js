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

import moment from 'moment'

import {
  InsightOriginStorage,
} from '../../storage'

import { nodeInterface } from './Node'


export default new GraphQLObjectType({

  name: 'Insight',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'Insight',

  fields: () => ({

    id: globalIdField('Insight'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    origin: {
      type: InsightOriginType,
      resolve: ({ id }) => InsightOriginStorage.load(id).catch(() => null)
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ created_at }) => moment(created_at).format('YYYY-MM-DD hh:mm:ss')
    },

  })

})


import InsightOriginType from './InsightOriginType'
