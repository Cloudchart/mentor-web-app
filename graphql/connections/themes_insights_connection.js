import { GraphQLBoolean } from 'graphql'

import { connectionDefinitions } from 'graphql-relay'


import InsightType from '../types/insight_type'


let { edgeType, connectionType } = connectionDefinitions({

  name: 'ThemesInsights',

  nodeType: InsightType

})

export { edgeType, connectionType }
