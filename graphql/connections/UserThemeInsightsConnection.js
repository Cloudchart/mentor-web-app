import {
  connectionDefinitions
} from 'graphql-relay'


export default connectionDefinitions({

  name: 'UserThemeInsights',

  nodeType: UserThemeInsightType,

})


import UserThemeInsightType from '../types/UserThemeInsightType'
