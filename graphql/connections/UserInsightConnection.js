import {
  GraphQLEnumType
} from 'graphql'

import {
  connectionDefinitions
} from 'graphql-relay'


let UserInsightFilterEnum = new GraphQLEnumType({
  name: 'UserInsightFilterEnum',

  values: {
    POSITIVE: { value: 'positive' },
    NEGATIVE: { value: 'negative' },
    UNRATED:  { value: 'unrated'  },
  }
})


export default connectionDefinitions({

  name: 'UserInsight',

  nodeType: UserThemeInsightType,

})

export { UserInsightFilterEnum }

import UserThemeInsightType from '../types/UserThemeInsightType'
