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
} from '../../storage'

import InsightType from '../types/InsightsType'


let countUserCollectionInsights = async (filter, user_collection_id) =>
  await InsightStorage
    .count(filter + 'ForUserCollection', { user_collection_id })


export const FilterEnum = new GraphQLEnumType({
  name: 'UserCollectionInsightsFilter',

  values: {
    ALL:      { value: 'all'      },
    USEFUL:   { value: 'useful'   },
    USELESS:  { value: 'useless'  },
  }
})



export const Connection = connectionDefinitions({
  name: 'UserCollectionInsights',

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => countUserCollectionInsights('all', userCollection.id)
    },
    usefulCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => countUserCollectionInsights('useful', userCollection.id)
    },
    uselessCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ userCollection }) => countUserCollectionInsights('useless', userCollection.id)
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
      type: FilterEnum,
      defaultValue: 'useful',
    },
  },

  resolve: async (userCollection, { filter, ...args }, { rootValue: { viewer } }) => {
    let insights = await InsightStorage.loadAll(filter + 'ForUserCollection', { user_collection_id: userCollection.id })
    return {
      ...connectionFromArray(insights, args),
      userCollection,
      viewer,
    }
  }
}
