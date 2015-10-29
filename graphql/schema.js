import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql'


import ViewerQuery from './queries/Viewer'
import ThemesQuery from './queries/Themes'
import NodeQuery from './queries/Node'


let queryType = new GraphQLObjectType({

  name: 'Query',

  fields: () => ({
    viewer: ViewerQuery,
    themes: ThemesQuery,
    node:   NodeQuery
  })

})


let mutationType = new GraphQLObjectType({

  name: 'Mutation',

  fields: {
  }

})


let Schema = new GraphQLSchema({

  query:      queryType,
  // mutation:   mutationType

})

export default Schema
