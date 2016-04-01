import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'

import {
  TopicLinkStorage
} from '../../storage'


import TopicLinkInsightsConnection from '../connections/TopicLinkInsights'


export default new GraphQLObjectType({

  name: 'TopicLink',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('TopicLink'),

    url: {
      type: new GraphQLNonNull(GraphQLString)
    },

    title: {
      type: new GraphQLNonNull(GraphQLString)
    },

    insights: TopicLinkInsightsConnection

  })

})
