import {
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import { nodeInterface } from './Node'

export default new GraphQLObjectType({

  name: 'ThemeInsight',

  interfaces: [nodeInterface],

  isTypeOf: ({ __type }) => __type === 'ThemeInsight',

  fields: () => ({

    id: globalIdField('ThemeInsight'),

  })

})
