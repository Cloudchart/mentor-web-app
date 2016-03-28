import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
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


export const UserCollectionInsightsConnectionFilterEnum = new GraphQLEnumType({
  name: 'UserCollectionInsightsFilterEnum',

  values: {
    ALL:      { value: 'all'      },
    USEFUL:   { value: 'useful'   },
    USELESS:  { value: 'useless'  },
  }
})



const Connection = connectionDefinitions({
  name: 'UserCollectionInsights',

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => {
        return await UserCollectionInsightStorage.loadAllIDs('allForUserCollection', { user_collection_id: userCollection.id })
          .then(ids => ids.length)
      }
    },
    usefulCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => {
        return await UserCollectionInsightStorage.loadAllIDs('usefulForUserCollection', { user_collection_id: userCollection.id })
          .then(ids => ids.length)
      }
    },
    uselessCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => {
        return await UserCollectionInsightStorage.loadAllIDs('uselessForUserCollection', { user_collection_id: userCollection.id })
          .then(ids => ids.length)
      }
    }
  },

  nodeType: InsightType
})


export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: Connection.connectionType,

  args: {
    ...connectionArgs,
    filter: {
      type: UserCollectionInsightsConnectionFilterEnum,
      defaultValue: 'useful',
    },
  },

  resolve: async (userCollection, { filter, ...args }, { rootValue: { viewer } }) => {
    let links = await UserCollectionInsightStorage.loadAll(filter + 'ForUserCollection', { user_collection_id: userCollection.id })
    let insights = await InsightStorage.loadMany(links.map(link => link.insight_id))
    return {
      ...connectionFromArray(insights, args),
      userCollection,
    }
  }
}
