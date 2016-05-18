import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  InsightStorage,
  InsightOriginStorage,
} from '../../../storage'

import InsightType from '../../types/InsightsType'


export default mutationWithClientMutationId({

  name: 'UpdateInsight',

  inputFields: () => ({

    insightID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: GraphQLString,
    },

  }),

  outputFields: {

    insight: {
      type: new GraphQLNonNull(InsightType)
    }

  },

  mutateAndGetPayload: async ({ insightID, content, author, url }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let insight = await InsightStorage.load(fromGlobalId(insightID).id).catch(() => null)

    if (!insight)
      return new Error('Not found')

    insight = await InsightStorage.update(insight.id, { content })
    await InsightOriginStorage.update(insight.id, { content, author, url })

    return { insight }
  }

})
