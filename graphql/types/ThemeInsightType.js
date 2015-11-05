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

  fields: () => ({

    id: globalIdField('ThemeInsight'),

  })

})
