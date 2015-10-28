import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import { Viewer } from './queries'
import {
  ActivateViewer,
  ThemeToViewer,
  VoteForInsight,
  CreateThemeMutation,
  UpdateThemeStatus,
  UpdateUserTheme,
  ActualizeUserThemeInsights,
  ActualizeThemeInsights,
  LikeInsight,
  UpdateUserThemeInsight
} from './mutations'

let queryType = new GraphQLObjectType({

  name: 'Query',

  fields: {
    viewer: Viewer,
    node:   Viewer
  }

})


let mutationType = new GraphQLObjectType({

  name: 'Mutation',

  fields: {
    activateViewer:             ActivateViewer,
    themeToViewer:              ThemeToViewer,
    voteForInsight:             VoteForInsight,
    createTheme:                CreateThemeMutation,
    updateThemeStatus:          UpdateThemeStatus,
    updateUserTheme:            UpdateUserTheme,
    actualizeUserThemeInsights: ActualizeUserThemeInsights,
    actualizeThemeInsights:     ActualizeThemeInsights,
    likeInsight:                LikeInsight,
    updateUserThemeInsight:     UpdateUserThemeInsight
  }

})


let Schema = new GraphQLSchema({

  query:      queryType,
  mutation:   mutationType

})

export default Schema
