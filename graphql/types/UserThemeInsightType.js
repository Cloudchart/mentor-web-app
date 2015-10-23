import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'


import {
  InsightStorage
} from '../../storage'


let UserThemeInsightType = new GraphQLObjectType({

  name: 'UserThemeInsight',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ user_id, theme_id, insight_id}) => `${user_id}:${theme_id}:${insight_id}`
    },

    rate: {
      type: GraphQLInt
    },

    content: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ insight_id }) => InsightStorage.load(insight_id).then(insight => insight.content)
    },

    ratedAt: {
      type: GraphQLString,
      resolve: ({ updated_at }) => updated_at
    },

    insight: {
      type: new GraphQLNonNull(InsightType),
      deprecationReason: 'Simplifying UserThemeInsight type',
      resolve: ({ insight_id }) => InsightStorage.load(insight_id)
    }

  })

})

export default UserThemeInsightType

import InsightType from '../types/insight_type'
