import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'

import {
  InsightStorage,
  UserCollectionInsightStorage,
} from '../../storage'

import InsightType from '../types/InsightsType'


const Connection = connectionDefinitions({
  name: 'UserCollectionInsights',

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },

  nodeType: InsightType
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: Connection.connectionType,

  args: {
    ...connectionArgs
  },

  resolve: async (userCollection, { ...args }, { rootValue: { viewer } }) => {
    let links = await UserCollectionInsightStorage.loadAll('allForUserCollection', { user_collection_id: userCollection.id })
    let insights = await InsightStorage.loadMany(links.map(link => link.insight_id))
    return {
      ...connectionFromArray(insights, args),
      count: insights.length,
    }
  }
}
