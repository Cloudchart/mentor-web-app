import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'


import {
  ThemeStorage,
  InsightStorage
} from '../../storage'


let UserThemeInsightType = new GraphQLObjectType({

  name: 'UserThemeInsight',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
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

    theme: {
      type: ThemeType,
      resolve: ({ theme_id }) => ThemeStorage.load(theme_id)
    },

    insight: {
      type: new GraphQLNonNull(InsightType),
      deprecationReason: 'Simplifying UserThemeInsight type',
      resolve: ({ insight_id }) => InsightStorage.load(insight_id)
    }

  })

})

export default UserThemeInsightType

import ThemeType from '../types/theme_type'
import InsightType from '../types/insight_type'
