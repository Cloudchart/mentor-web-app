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
      resolve: ({ author }) => author || ''
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ url }) => url || ''
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ title }) => title || ''
    },

    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ duration }) => duration || 0
    },

  })

})
