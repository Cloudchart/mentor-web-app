import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AdminStorage,
  InsightStorage,
  InsightOriginStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'


export default mutationWithClientMutationId({

  name: 'DeleteInsight',

  inputFields: () => ({

    insightID: {
      type: new GraphQLNonNull(GraphQLID)
    },

  }),

  outputFields: {

    insightID: {
      type: new GraphQLNonNull(GraphQLID),
    },

    admin: {
      type: new GraphQLNonNull(AdminType),
    }

  },

  mutateAndGetPayload: async ({ insightID }, { viewer }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized')

    let insight = await InsightStorage.load(fromGlobalId(insightID).id).catch(() => null)

    if (!insight)
      return new Error('Not found')

    await InsightStorage.destroy(insight.id)
    await InsightOriginStorage.destroy(insight.id).catch(() => null)

    let admin = await AdminStorage.load(viewer.id)

    return { insightID, admin }
  }

})
