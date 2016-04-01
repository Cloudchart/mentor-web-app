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
  UserThemeStorage
} from '../../storage'

import TopicInsightsConnection from '../connections/TopicInsightsConnection'
import TopicLinksConnection from '../connections/TopicLinksConnection'


export default new GraphQLObjectType({

  name: 'Topic',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Topic'),

    name: {
      type: GraphQLString
    },

    isDefault: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_default }) => !!is_default
    },

    isPaid: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: () => false
    },

    isSubscribedByViewer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async ({ id }, args, { rootValue: { viewer } }) => {
        let link = await UserThemeStorage.loadOne('unique', { userID: viewer.id, themeID: id })
        return link && link.status === 'subscribed'
      }
    },

    insights: TopicInsightsConnection,

    links: TopicLinksConnection,

  })

})
