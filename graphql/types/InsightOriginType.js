import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

export default new GraphQLObjectType({

  name: 'InsightOrigin',

  fields: () => ({

    author: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    duration: {
      type: new GraphQLNonNull(GraphQLInt),
    },

  })

})