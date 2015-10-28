import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
} from 'graphql'


import UserThemeStorage from '../../storage/user_theme_storage'


let loadUserTheme = (userID, themeID) =>
  UserThemeStorage
    .load(userID, themeID)
    .then(record => record)
    .catch(error => null)


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

    isSubscribedByViewer: {
      type: GraphQLBoolean,
      resolve: (theme, _, { rootValue: { viewer } }) =>
        loadUserTheme(viewer.id, theme.id)
          .then(record => record ? record.status === 'subscribed' : false)
    },

    isRejectedByViewer: {
      type: GraphQLBoolean,
      resolve: (theme, _, { rootValue: { viewer } }) =>
        loadUserTheme(viewer.id, theme.id)
          .then(record => record ? record.status === 'rejected' : false)
    }

  })

})

export default ThemeType
