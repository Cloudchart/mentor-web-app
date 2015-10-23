import {
  connectionDefinitions
} from 'graphql-relay'


export default connectionDefinitions({

  name: 'UserInsights',

  nodeType: UserThemeInsightType,

})


import UserThemeInsightType from '../types/UserThemeInsightType'
