import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeToEdge
} from '../../connections/arrayconnection'

import {
  EdgeType
} from '../../connections/AdminInsights'

import {
  AdminStorage,
  InsightStorage,
  InsightOriginStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'
import InsightType from '../../types/InsightsType'


export default mutationWithClientMutationId({

  name: 'CreateInsight',

  inputFields: {

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: GraphQLString,
    },

  },

  outputFields: {

    insightEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ insight }) => nodeToEdge(insight)
    },

    admin: {
      type: new GraphQLNonNull(AdminType)
    }

  },

  mutateAndGetPayload: async ({ content, author, url }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let insight = await InsightStorage.create({ content })
    await InsightOriginStorage.create({ id: insight.id, author, url })

    let admin = await AdminStorage.load(viewer.id)

    return { insight, admin }
  }

})
