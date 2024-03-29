import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  AdminInsightStorage
} from '../../../storage'

import {
  connectionFromArray
} from '../arrayconnection'

import AdminInsightType from '../../types/admin/AdminInsightType'


const adminInsightsConnectionArgs = {
  ...connectionArgs,
  query: {
    type: GraphQLString,
  }
}

const adminInsightsConnection = connectionDefinitions({
  name: 'AdminInsights',
  nodeType: AdminInsightType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})

async function adminInsightsConnectionResolve(_, args) {
  let adminInsights

  if (args.query) {
    adminInsights = await AdminInsightStorage.loadAll('search', { query: args.query })
  } else {
    adminInsights = await AdminInsightStorage.loadAll('default')
  }

  return Object.assign(connectionFromArray(adminInsights, args), { count: adminInsights.length })
}

export default {
  type: adminInsightsConnection.connectionType,
  args: adminInsightsConnectionArgs,
  resolve: adminInsightsConnectionResolve
}
