import {
  GraphQLObjectType
} from 'graphql'


import ViewerQuery from './ViewerQuery'
import NodeQuery from './NodeQuery'
import AdminQuery from './AdminQuery'


export default new GraphQLObjectType({
  name: 'Query',

  fields: {
    viewer:   ViewerQuery,
    node:     NodeQuery,
    admin:    AdminQuery,
  }
})
