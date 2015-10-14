import { GraphQLID } from 'graphql'

import { connectionDefinitions } from 'graphql-relay'

import InsightType from '../types/insight_type'
import ThemeType from '../types/theme_type'

import { Theme } from '../../models'


let { edgeType, connectionType } = connectionDefinitions({

  name: 'UserInsights',

  edgeFields: () => ({
    theme: {
      type: ThemeType,
      resolve: ({ node }) => Theme.findById(node.theme_id)
    }
  }),

  nodeType: InsightType

})

export { edgeType, connectionType }
