import {
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  connectionDefinitions
} from 'graphql-relay'


export default connectionDefinitions({

  name: 'Theme',

  nodeType: ThemeType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }

})


import ThemeType from '../types/theme_type'
