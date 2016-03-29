import {
  GraphQLSchema,
} from 'graphql'

import QueryType from './queries'
import MutationType from './mutations'


export default new GraphQLSchema({

  query:      QueryType,
  mutation:   MutationType,

})
