import {
  GraphQLID,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId,
  cursorForObjectInConnection
} from 'graphql-relay'

import { edgeType as InsightEdge } from '../connections/themes_insights_connection'
import { ThemeType, UserType } from '../types'
import { Insight, Theme } from '../../models'


export default mutationWithClientMutationId({

  name: 'VoteForInsight',

  inputFields: {
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    insightID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    isPositive: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },

  outputFields: {
    theme: {
      type: ThemeType,
      resolve: ({ themeID }) => Theme.findById(themeID)
    },

    viewer: {
      type: UserType,
      resolve: (root, _, { rootValue: { viewer } }) => viewer
    },

    insightID: {
      type: GraphQLID
    },

    insightEdge: {
      type: InsightEdge,
      resolve: async ({ insightID, themeID }, _, { rootValue: { viewer } }) => {
        let insight = await Insight.findById(insightID)
        let records = await viewer.getUserInsightThemes({ where: { theme_id: themeID }})
        return {
          node:   insight,
          cursor: cursorForObjectInConnection(records.map(record => record.insight_id), insight.id)
        }
      }
    }
  },

  mutateAndGetPayload: async ({ themeID, insightID, isPositive }, { rootValue: { viewer } }) => {
    // await viewer.createUserInsightTheme({
    //   user_id:      viewer.id,
    //   insight_id:   insightID,
    //   theme_id:     themeID,
    //   is_positive:  isPositive
    // })

    return { themeID, insightID }
  }

})
