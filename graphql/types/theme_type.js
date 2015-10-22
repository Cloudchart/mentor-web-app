import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
} from 'graphql'


let ThemeType = new GraphQLObjectType({

  name: 'Theme',

  fields: () => ({
    id: {
      type: GraphQLID
    },

    name: {
      type: GraphQLString
    },

    url: {
      type: GraphQLString,
      resolve: theme => `/themes/${theme.id}`
    },

    isSystem: {
      type: GraphQLBoolean,
      resolve: theme => theme.is_system
    },

    isDefault: {
      type: GraphQLBoolean,
      resolve: theme => theme.is_default
    },

  })

})

export default ThemeType
