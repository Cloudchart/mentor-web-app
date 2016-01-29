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
  AdmininsightStorage
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
    adminInsights = await AdmininsightStorage.loadAll('search', { query: args.query })
  } else {
    adminInsights = await AdmininsightStorage.loadAll('default')
  }

  return Object.assign(connectionFromArray(adminInsights, args), { count: adminInsights.length })
}

export default {
  type: adminInsightsConnection.connectionType,
  args: adminInsightsConnectionArgs,
  resolve: adminInsightsConnectionResolve
}
