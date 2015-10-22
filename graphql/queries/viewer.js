import {
  GraphQLID
} from 'graphql'

import { UserType } from '../types'

export default {
  type: UserType,
  args: {
    id: {
      type: GraphQLID
    }
  },
  resolve: (root, _, { rootValue: { viewer }}) => viewer
}
