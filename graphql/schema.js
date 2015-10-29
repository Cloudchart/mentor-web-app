import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql'


import ViewerQuery from './queries/Viewer'
import NodeQuery from './queries/Node'


let queryType = new GraphQLObjectType({

  name: 'Query',

  fields: () => ({
    viewer: ViewerQuery,
    node:   NodeQuery
  })

})


import ActivateUserMutation from './mutations/ActivateUserMutation'
import UpdateUserThemeMutation from './mutations/UpdateUserThemeMutation'


let mutationType = new GraphQLObjectType({

  name: 'Mutation',

  fields: {
    activateUser:     ActivateUserMutation,
    updateUserTheme:  UpdateUserThemeMutation
  }

})


let Schema = new GraphQLSchema({

  query:      queryType,
  mutation:   mutationType

})

export default Schema
