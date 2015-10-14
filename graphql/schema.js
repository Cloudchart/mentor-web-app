import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import { Viewer, Theme } from './queries'
import { ActivateViewer, ThemeToViewer, VoteForInsight } from './mutations'

let queryType = new GraphQLObjectType({

  name: 'Query',

  fields: {
    viewer: Viewer,
    theme:  Theme
  }

})


let mutationType = new GraphQLObjectType({

  name: 'Mutation',

  fields: {
    activateViewer:   ActivateViewer,
    themeToViewer:    ThemeToViewer,
    voteForInsight:   VoteForInsight
  }

})


let Schema = new GraphQLSchema({

  query:      queryType,
  mutation:   mutationType

})

export default Schema
